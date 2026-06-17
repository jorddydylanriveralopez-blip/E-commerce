import { getSql } from "@/lib/db";
import type { StoredUser } from "@/lib/users-store";
import { ensureAuthTables } from "@/lib/otp-db";

function rowToUser(row: Record<string, unknown>): StoredUser {
  return {
    id: row.id as string,
    name: row.name as string,
    email: (row.email as string) || undefined,
    phone: (row.phone as string) || undefined,
    whatsapp: (row.whatsapp as string) || undefined,
    passwordHash: (row.password_hash as string) || undefined,
    image: (row.image as string) || undefined,
    birthDate: (row.birth_date as string) || undefined,
    bio: (row.bio as string) || undefined,
    sellerRating: row.seller_rating != null ? Number(row.seller_rating) : undefined,
    sellerReviewCount:
      row.seller_review_count != null ? Number(row.seller_review_count) : undefined,
    provider: row.provider as StoredUser["provider"],
    createdAt: (row.created_at as string) ?? new Date().toISOString(),
  };
}

export async function findUserByPhoneDb(phone: string): Promise<StoredUser | undefined> {
  await ensureAuthTables();
  const sql = getSql();
  const rows = await sql`SELECT * FROM users WHERE phone = ${phone} LIMIT 1`;
  const row = rows[0];
  return row ? rowToUser(row as Record<string, unknown>) : undefined;
}

export async function findUserByIdDb(id: string): Promise<StoredUser | undefined> {
  await ensureAuthTables();
  const sql = getSql();
  const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
  const row = rows[0];
  return row ? rowToUser(row as Record<string, unknown>) : undefined;
}

export async function createPhoneUserDb(phone: string, name?: string): Promise<StoredUser> {
  await ensureAuthTables();
  const existing = await findUserByPhoneDb(phone);
  if (existing) return existing;

  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: name ?? `Yaavser ${phone.slice(-4)}`,
    phone,
    whatsapp: phone,
    provider: "phone",
    createdAt: new Date().toISOString(),
  };

  const sql = getSql();
  await sql`
    INSERT INTO users (id, name, phone, whatsapp, provider, created_at)
    VALUES (
      ${user.id},
      ${user.name},
      ${user.phone},
      ${user.whatsapp},
      ${user.provider},
      ${user.createdAt}
    )
  `;

  return user;
}
