import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is NOT set!");
    if (process.env.NODE_ENV === "production") {
      // Don't crash the whole signup in prod, use a fallback with a warning
      // Ideally set JWT_SECRET in Vercel!
      return "finflow-fallback-secret-change-me-please-2024";
    }
    return "finflow-secret-key-change-in-production-2024";
  }
  return secret;
}

const getJwtSecretKey = () => new TextEncoder().encode(getJwtSecret());

export function getSessionCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  };
}

export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getJwtSecretKey());
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("finflow_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
