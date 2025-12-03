import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SESSION_COOKIE = "patentes_session";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change";
const SESSION_DAYS = 30;

/** Hash plain-text password using bcrypt. */
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/** Validate a password against an existing hash. */
export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

/** Create a signed JWT for the current user id and store it in an http-only cookie. */
export function createSession(userId: string) {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: `${SESSION_DAYS}d`
  });
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
    path: "/"
  });
}

/** Remove session cookie. */
export function clearSession() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Fetch the logged in user by decoding the JWT stored in cookies. */
export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    return user;
  } catch (error) {
    return null;
  }
}

/** Guard helper that throws a redirect when the user is not authenticated. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}
