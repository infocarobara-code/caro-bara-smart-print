import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_SESSION_COOKIE = "caro_bara_admin_session";

function getEnvValue(key: string) {
  const value = process.env[key];

  if (!value || !value.trim()) {
    throw new Error(`${key} is missing`);
  }

  return value.trim();
}

function createSessionSignature(username: string) {
  const secret = getEnvValue("ADMIN_SESSION_SECRET");

  return createHmac("sha256", secret).update(username).digest("hex");
}

function buildSessionValue(username: string) {
  const signature = createSessionSignature(username);
  return `${username}.${signature}`;
}

function safeEqual(a: string, b: string) {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return timingSafeEqual(bufferA, bufferB);
}

export async function verifyAdminCredentials(
  username: string,
  password: string
) {
  const adminUser = getEnvValue("ADMIN_USER");
  const adminPassword = getEnvValue("ADMIN_PASSWORD");

  return username === adminUser && password === adminPassword;
}

export async function createAdminSession(username: string) {
  const cookieStore = await cookies();
  const sessionValue = buildSessionValue(username);

  cookieStore.set(ADMIN_SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionCookie) {
    return false;
  }

  const adminUser = getEnvValue("ADMIN_USER");
  const expectedValue = buildSessionValue(adminUser);

  return safeEqual(sessionCookie, expectedValue);
}