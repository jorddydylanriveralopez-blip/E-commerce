import { NextResponse } from "next/server";
import { createEmailUser } from "@/lib/users-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, whatsapp } = body;

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: "Completa todos los campos" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    const user = await createEmailUser({
      name: name.trim(),
      email: email.trim(),
      password,
      whatsapp: whatsapp?.trim(),
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al registrar";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
