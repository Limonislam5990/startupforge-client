import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { auth } from "../../../lib/auth";

const ONE_DAY = 60 * 60 * 24;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

// Issues the JWT used by the Express server. Only works for a valid Better Auth session.
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
  if (session.user.isBlocked) return NextResponse.json({ message: "Your account is blocked" }, { status: 403 });
  if (!process.env.JWT_SECRET) {
    return NextResponse.json({ message: "JWT_SECRET is not configured" }, { status: 500 });
  }

  const token = jwt.sign({ email: session.user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", token, { ...cookieOptions, maxAge: ONE_DAY });
  return res;
}

// Called on logout
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", "", { ...cookieOptions, maxAge: 0 });
  return res;
}
