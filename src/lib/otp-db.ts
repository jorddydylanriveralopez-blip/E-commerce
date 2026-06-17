import { getSql, hasDatabase } from "@/lib/db";

export async function ensureAuthTables() {
  if (!hasDatabase()) return;

  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS phone_otps (
      phone TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT UNIQUE,
      whatsapp TEXT,
      password_hash TEXT,
      image TEXT,
      birth_date TEXT,
      bio TEXT,
      seller_rating NUMERIC DEFAULT 5,
      seller_review_count INT DEFAULT 0,
      provider TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export async function storeOtpDb(phone: string, code: string) {
  const sql = getSql();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  await sql`
    INSERT INTO phone_otps (phone, code, expires_at)
    VALUES (${phone}, ${code}, ${expiresAt})
    ON CONFLICT (phone) DO UPDATE
    SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at
  `;
}

export async function verifyOtpDb(phone: string, code: string): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`
    SELECT code, expires_at FROM phone_otps WHERE phone = ${phone} LIMIT 1
  `;
  const row = rows[0] as { code: string; expires_at: string } | undefined;
  if (!row) return false;

  if (new Date(row.expires_at).getTime() < Date.now()) {
    await sql`DELETE FROM phone_otps WHERE phone = ${phone}`;
    return false;
  }

  if (row.code !== code) return false;

  await sql`DELETE FROM phone_otps WHERE phone = ${phone}`;
  return true;
}
