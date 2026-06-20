import { headers } from "next/headers";

const attempts = new Map<string, { count: number; expiresAt: number }>();

export function cleanText(value: unknown, max = 300) {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export async function rateLimit(action: string, max = 8, windowMs = 60_000) {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || headerStore.get("x-real-ip") || "local";
  const key = `${action}:${ip}`;
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.expiresAt < now) {
    attempts.set(key, { count: 1, expiresAt: now + windowMs });
    return;
  }

  if (current.count >= max) {
    throw new Error("Too many attempts. Please wait a minute and try again.");
  }

  current.count += 1;
}
