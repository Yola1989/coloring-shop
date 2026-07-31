import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "admin_session";

function getSecret() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD env var is not set");
  }
  return password;
}

// Value stored in the cookie: sha256(password), so we never store the
// plaintext password itself in the browser.
function sessionToken() {
  return crypto.createHash("sha256").update(getSecret()).digest("hex");
}

// Compare hashes with a constant-time function so an attacker cannot
// learn the password one character at a time by measuring response time.
export function checkPassword(input: string) {
  if (typeof input !== "string" || input.length === 0) return false;

  const given = crypto.createHash("sha256").update(input).digest();
  const expected = crypto.createHash("sha256").update(getSecret()).digest();

  return crypto.timingSafeEqual(given, expected);
}

export async function createSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthenticated() {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  return value === sessionToken();
}

export { COOKIE_NAME };
