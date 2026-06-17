import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  readUserAvatar,
  saveUserAvatar,
  updateUserProfile,
} from "@/lib/users-store";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const session = await auth();
  const targetId = userId ?? session?.user?.id;

  if (!targetId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const buffer = await readUserAvatar(targetId);
  if (!buffer) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "private, max-age=3600",
    },
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Selecciona una imagen" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Usa JPG, PNG o WebP" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "La imagen debe pesar menos de 5 MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const imageUrl = await saveUserAvatar(session.user.id, buffer);
    const user = await updateUserProfile(session.user.id, { image: imageUrl });

    if (!user) {
      return NextResponse.json({ error: "No se pudo guardar" }, { status: 500 });
    }

    return NextResponse.json({ image: imageUrl });
  } catch {
    return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 });
  }
}
