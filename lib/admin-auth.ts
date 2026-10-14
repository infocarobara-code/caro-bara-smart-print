import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_SESSION_COOKIE = "caro_bara_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getEnvValue(key: string) {
  const value = process.env[key];

  if (!value || !value.trim()) {
    throw new Error(`${key} is missing`);
  }

  return value.trim();
}

function getOptionalEnvValue(key: string) {
  const value = process.env[key];
  return value && value.trim() ? value.trim() : "";
}

function createSessionSignature(payload: string) {
  const secret = getEnvValue("ADMIN_SESSION_SECRET");

  return createHmac("sha256", secret).update(payload).digest("hex");
}

function buildSessionValue(username: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE;
  const payload = `${username}.${expiresAt}`;
  return `${payload}.${createSessionSignature(payload)}`;
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

  return safeEqual(username, adminUser) && safeEqual(password, adminPassword);
}

export async function createAdminSession(username: string) {
  const cookieStore = await cookies();
  const sessionValue = buildSessionValue(username);

  cookieStore.set(ADMIN_SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
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

  const adminUser = getOptionalEnvValue("ADMIN_USER");
  const sessionSecret = getOptionalEnvValue("ADMIN_SESSION_SECRET");

  if (!adminUser || !sessionSecret) {
    return false;
  }

  const signatureSeparator = sessionCookie.lastIndexOf(".");
  const payload = sessionCookie.slice(0, signatureSeparator);
  const expirySeparator = payload.lastIndexOf(".");
  if (signatureSeparator < 0 || expirySeparator < 0) return false;

  const username = payload.slice(0, expirySeparator);
  const expiryText = payload.slice(expirySeparator + 1);
  if (!/^\d+$/.test(expiryText)) return false;
  const expiresAt = Number(expiryText);
  const now = Math.floor(Date.now() / 1000);
  if (
    !safeEqual(username, adminUser) ||
    !Number.isSafeInteger(expiresAt) ||
    expiresAt <= now ||
    expiresAt > now + ADMIN_SESSION_MAX_AGE
  ) return false;

  return safeEqual(
    sessionCookie.slice(signatureSeparator + 1),
    createSessionSignature(payload)
  );
}
