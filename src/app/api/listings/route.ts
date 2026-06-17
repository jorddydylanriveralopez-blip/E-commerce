import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasDatabase } from "@/lib/db";
import { createListing } from "@/lib/listings-db";
import { getAllListings } from "@/lib/listings";
import { applyExploreFilters, parseExploreFilters } from "@/lib/explore-filters";
import { Category } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters = parseExploreFilters(searchParams);
  const category = filters.categoria ?? "todos";

  let items = await getAllListings(category);
  items = applyExploreFilters(items, filters);

  return NextResponse.json({ listings: items, filters });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
  }

  if (!hasDatabase()) {
    return NextResponse.json(
      { error: "Base de datos no configurada. Agrega DATABASE_URL en .env.local" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      price,
      priceType,
      location,
      whatsapp,
      tags,
    } = body;

    if (!title?.trim() || !description?.trim() || !category || !location?.trim() || !whatsapp?.trim()) {
      return NextResponse.json({ error: "Completa los campos obligatorios" }, { status: 400 });
    }

    if (category !== "productos" && category !== "servicios") {
      return NextResponse.json({ error: "Categoría inválida" }, { status: 400 });
    }

    const listing = await createListing({
      userId: session.user.id,
      authorName: session.user.name ?? "Yaavser",
      authorImage: session.user.image,
      title: title.trim(),
      description: description.trim(),
      category: category as Category,
      price: price ? Number(price) : undefined,
      priceType: priceType ?? "desde",
      location: location.trim(),
      whatsapp: whatsapp.trim(),
      tags: typeof tags === "string"
        ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : Array.isArray(tags)
          ? tags
          : [],
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error) {
    console.error("listings POST error:", error);
    return NextResponse.json({ error: "No se pudo publicar el anuncio" }, { status: 500 });
  }
}
