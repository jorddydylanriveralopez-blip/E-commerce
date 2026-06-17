import { NextResponse } from "next/server";
import { normalizePhone } from "@/lib/users-store";
import { generateOtp, storeOtp } from "@/lib/otp-store";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    const normalized = normalizePhone(phone ?? "");

    if (normalized.length < 10) {
      return NextResponse.json(
        { error: "Ingresa un número válido de 10 dígitos" },
        { status: 400 }
      );
    }

    const code = generateOtp();
    storeOtp(normalized, code);

    // En producción: enviar SMS con Twilio, etc.
    console.log(`[Yaavstore OTP] ${normalized} → ${code}`);

    const isDev = process.env.NODE_ENV === "development";

    return NextResponse.json({
      success: true,
      message: "Código enviado",
      ...(isDev ? { demoCode: code } : {}),
    });
  } catch {
    return NextResponse.json({ error: "No se pudo enviar el código" }, { status: 500 });
  }
}
