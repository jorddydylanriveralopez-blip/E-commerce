import { hasDatabase } from "@/lib/db";
import {
  ensureAuthTables,
  storeOtpDb,
  verifyOtpDb,
} from "@/lib/otp-db";

const otpStore = new Map<string, { code: string; expires: number }>();

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function isDemoOtpEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.ENABLE_DEMO_OTP === "true"
  );
}

export function isDemoOtpCode(code: string): boolean {
  if (!isDemoOtpEnabled()) return false;
  const demo = process.env.OTP_DEMO_CODE ?? "123456";
  return code === demo;
}

export async function storeOtp(phone: string, code: string) {
  if (hasDatabase()) {
    await ensureAuthTables();
    await storeOtpDb(phone, code);
    return;
  }
  otpStore.set(phone, {
    code,
    expires: Date.now() + 5 * 60 * 1000,
  });
}

export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  if (isDemoOtpCode(code)) return true;

  if (hasDatabase()) {
    await ensureAuthTables();
    return verifyOtpDb(phone, code);
  }

  const entry = otpStore.get(phone);
  if (!entry) return false;
  if (Date.now() > entry.expires) {
    otpStore.delete(phone);
    return false;
  }
  const valid = entry.code === code;
  if (valid) otpStore.delete(phone);
  return valid;
}
