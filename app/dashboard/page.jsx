import { headers } from "next/headers";
import { auth } from "../../lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session.user;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">Welcome, {user.name}</h1>
      <p className="mt-2 text-slate-600">
        You are logged in as <span className="font-semibold">{user.role}</span>.
      </p>
      <p className="mt-6 text-sm text-slate-500">
        Role based dashboards (founder, collaborator, admin) will be added here.
      </p>
    </main>
  );
}