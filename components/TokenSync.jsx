import { headers, cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { auth } from "../../../lib/auth";

const cookieOptions = {
  httpOnly: true, // JavaScript in the browser can never read this cookie
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24, // 1 day
};

// Issues a JWT, but only for a user whose Better Auth session is valid
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (session.user.isBlocked) {
    return Response.json({ message: "Account blocked" }, { status: 403 });
  }

  const token = jwt.sign({ email: session.user.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  (await cookies()).set("token", token, cookieOptions);
  return Response.json({ success: true });
}

// Called on logout
export async function DELETE() {
  (await cookies()).delete("token");
  return Response.json({ success: true });
}