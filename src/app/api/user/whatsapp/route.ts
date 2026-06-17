import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateUserWhatsapp } from "@/lib/users-store";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { whatsapp } = await request.json();
    if (!whatsapp?.trim()) {
      return NextResponse.json({ error: "Ingresa un número válido" }, { status: 400 });
    }

    const user = await updateUserWhatsapp(session.user.id, whatsapp);
    if (!user) {
      return NextResponse.json({ error: "Número inválido" }, { status: 400 });
    }

    return NextResponse.json({ whatsapp: user.whatsapp });
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
