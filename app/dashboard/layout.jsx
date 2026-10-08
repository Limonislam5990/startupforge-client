import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";

export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });

  // Cookie existed but session is invalid or expired
  if (!session) redirect("/login?callbackUrl=/dashboard");

  // Blocked by admin
  if (session.user.isBlocked) redirect("/blocked");

  // Sidebar will be added here later
  return <>{children}</>;
}