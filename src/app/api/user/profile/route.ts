import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { findUserById, updateUserProfile } from "@/lib/users-store";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await findUserById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      whatsapp: user.whatsapp,
      image: user.image,
      birthDate: user.birthDate ?? "",
      bio: user.bio ?? "",
      sellerRating: user.sellerRating ?? 5,
      sellerReviewCount: user.sellerReviewCount ?? 0,
      provider: user.provider,
      memberSince: user.createdAt.slice(0, 10),
    },
  });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, birthDate, bio, whatsapp } = body;

    if (name !== undefined && !String(name).trim()) {
      return NextResponse.json({ error: "El nombre no puede estar vacío" }, { status: 400 });
    }

    if (birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      return NextResponse.json({ error: "Fecha de nacimiento inválida" }, { status: 400 });
    }

    const user = await updateUserProfile(session.user.id, {
      name: name !== undefined ? String(name).trim() : undefined,
      birthDate: birthDate === "" ? null : birthDate,
      bio: bio !== undefined ? String(bio) : undefined,
      whatsapp: whatsapp !== undefined ? String(whatsapp) : undefined,
    });

    if (!user) {
      return NextResponse.json({ error: "No se pudo actualizar el perfil" }, { status: 400 });
    }

    return NextResponse.json({
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        whatsapp: user.whatsapp,
        image: user.image,
        birthDate: user.birthDate ?? "",
        bio: user.bio ?? "",
        sellerRating: user.sellerRating ?? 5,
        sellerReviewCount: user.sellerReviewCount ?? 0,
      },
    });
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
