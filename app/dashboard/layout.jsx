import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import DashboardShell from "../../components/dashboard/DashboardShell";

export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });

  // Cookie existed but session is invalid or expired
  if (!session) redirect("/login?callbackUrl=/dashboard");

  // Blocked by admin
  if (session.user.isBlocked) redirect("/blocked");

  const u = session.user;
  const user = {
    name: u.name,
    email: u.email,
    image: u.image || null,
    role: u.role || "collaborator",
  };

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
