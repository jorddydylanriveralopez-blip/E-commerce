import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { hasDatabase } from "@/lib/db";
import {
  createPhoneUserDb,
  findUserByIdDb,
  findUserByPhoneDb,
} from "@/lib/users-db";

export interface StoredUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  passwordHash?: string;
  image?: string;
  birthDate?: string;
  bio?: string;
  sellerRating?: number;
  sellerReviewCount?: number;
  provider: "email" | "phone" | "facebook" | "google" | "instagram";
  createdAt: string;
}

const DATA_DIR =
  process.env.VERCEL === "1"
    ? path.join("/tmp", "yaavstore-data")
    : path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
export const AVATARS_DIR = path.join(DATA_DIR, "avatars");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readUsers(): Promise<StoredUser[]> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]) {
  await ensureDataDir();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  const users = await readUsers();
  return users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
}

export async function findUserByPhone(phone: string): Promise<StoredUser | undefined> {
  const normalized = normalizePhone(phone);
  if (hasDatabase()) {
    return findUserByPhoneDb(normalized);
  }
  const users = await readUsers();
  return users.find((u) => u.phone === normalized);
}

export async function findUserById(id: string): Promise<StoredUser | undefined> {
  if (hasDatabase()) {
    return findUserByIdDb(id);
  }
  const users = await readUsers();
  return users.find((u) => u.id === id);
}

export async function createEmailUser(data: {
  name: string;
  email: string;
  password: string;
  whatsapp?: string;
}): Promise<StoredUser> {
  const existing = await findUserByEmail(data.email);
  if (existing) throw new Error("Este correo ya está registrado");

  const passwordHash = await bcrypt.hash(data.password, 10);
  const whatsapp = data.whatsapp ? normalizePhone(data.whatsapp) : undefined;
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email.toLowerCase(),
    whatsapp,
    phone: whatsapp,
    passwordHash,
    provider: "email",
    createdAt: new Date().toISOString(),
  };

  const users = await readUsers();
  users.push(user);
  await writeUsers(users);
  return user;
}

export async function createPhoneUser(phone: string, name?: string): Promise<StoredUser> {
  const normalized = normalizePhone(phone);
  const existing = await findUserByPhone(normalized);
  if (existing) return existing;

  if (hasDatabase()) {
    return createPhoneUserDb(normalized, name);
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: name ?? `Yaavser ${normalized.slice(-4)}`,
    phone: normalized,
    whatsapp: normalized,
    provider: "phone",
    createdAt: new Date().toISOString(),
  };

  const users = await readUsers();
  users.push(user);
  await writeUsers(users);
  return user;
}

export async function upsertOAuthUser(data: {
  id: string;
  name: string;
  email?: string;
  image?: string;
  provider: StoredUser["provider"];
}): Promise<StoredUser> {
  const users = await readUsers();
  const idx = users.findIndex((u) => u.id === data.id);

  const user: StoredUser = {
    id: data.id,
    name: data.name,
    email: data.email,
    image: data.image,
    provider: data.provider,
    createdAt: idx >= 0 ? users[idx].createdAt : new Date().toISOString(),
  };

  if (idx >= 0) {
    users[idx] = { ...users[idx], ...user };
  } else {
    users.push(user);
  }

  await writeUsers(users);
  return user;
}

/** @deprecated Use upsertOAuthUser */
export async function upsertFacebookUser(data: {
  id: string;
  name: string;
  email?: string;
  image?: string;
}): Promise<StoredUser> {
  return upsertOAuthUser({ ...data, provider: "facebook" });
}

export async function verifyEmailPassword(
  email: string,
  password: string
): Promise<StoredUser | null> {
  const user = await findUserByEmail(email);
  if (!user?.passwordHash) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").replace(/^52/, "").slice(-10);
}

export async function updateUserWhatsapp(
  userId: string,
  whatsapp: string
): Promise<StoredUser | null> {
  const normalized = normalizePhone(whatsapp);
  if (normalized.length < 10) return null;

  const users = await readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) return null;

  users[idx] = {
    ...users[idx],
    whatsapp: normalized,
    phone: users[idx].phone ?? normalized,
  };
  await writeUsers(users);
  return users[idx];
}

export type ProfileUpdateInput = {
  name?: string;
  birthDate?: string | null;
  bio?: string | null;
  whatsapp?: string;
  image?: string | null;
};

export async function updateUserProfile(
  userId: string,
  data: ProfileUpdateInput
): Promise<StoredUser | null> {
  const users = await readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) return null;

  const current = users[idx];

  if (data.name !== undefined) {
    const trimmed = data.name.trim();
    if (!trimmed) return null;
    current.name = trimmed;
  }

  if (data.birthDate !== undefined) {
    current.birthDate = data.birthDate || undefined;
  }

  if (data.bio !== undefined) {
    current.bio = data.bio?.trim().slice(0, 500) || undefined;
  }

  if (data.whatsapp !== undefined) {
    const normalized = normalizePhone(data.whatsapp);
    if (normalized.length < 10) return null;
    current.whatsapp = normalized;
    current.phone = current.phone ?? normalized;
  }

  if (data.image !== undefined) {
    current.image = data.image || undefined;
  }

  if (current.sellerRating === undefined) {
    current.sellerRating = 5;
  }
  if (current.sellerReviewCount === undefined) {
    current.sellerReviewCount = 0;
  }

  users[idx] = current;
  await writeUsers(users);
  return current;
}

export async function ensureAvatarsDir() {
  await fs.mkdir(AVATARS_DIR, { recursive: true });
}

export function avatarFilePath(userId: string) {
  return path.join(AVATARS_DIR, `${userId}.jpg`);
}

export async function saveUserAvatar(userId: string, buffer: Buffer): Promise<string> {
  await ensureAvatarsDir();
  const filePath = avatarFilePath(userId);
  await fs.writeFile(filePath, buffer);
  return `/api/user/avatar?v=${Date.now()}`;
}

export async function readUserAvatar(userId: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(avatarFilePath(userId));
  } catch {
    return null;
  }
}
