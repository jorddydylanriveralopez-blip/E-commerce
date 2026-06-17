import { NextResponse } from "next/server";
import { normalizePhone } from "@/lib/users-store";
import {
  generateOtp,
  isDemoOtpEnabled,
  storeOtp,
} from "@/lib/otp-store";

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
    await storeOtp(normalized, code);

    console.log(`[Yaavstore OTP] ${normalized} → ${code}`);

    const demoMode = isDemoOtpEnabled();

    return NextResponse.json({
      success: true,
      message: demoMode
        ? "Código de prueba generado (SMS no configurado aún)"
        : "Código enviado por SMS",
      ...(demoMode ? { demoCode: code } : {}),
    });
  } catch (error) {
    console.error("send-otp error:", error);
    return NextResponse.json({ error: "No se pudo enviar el código" }, { status: 500 });
  }
}
