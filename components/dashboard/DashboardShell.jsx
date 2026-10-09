"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  CreditCard,
  FileText,
  Inbox,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Plus,
  Rocket,
  Search,
  User,
  Users,
  X,
} from "lucide-react";
import { authClient } from "../../lib/auth-client";
import { Avatar } from "../ui";
import { DashboardUserContext } from "./user-context";

const MENUS = {
  founder: [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Startup", href: "/dashboard/my-startup", icon: Rocket },
    { name: "Add Opportunity", href: "/dashboard/add-opportunity", icon: Plus },
    { name: "Manage Opportunities", href: "/dashboard/manage-opportunities", icon: ListChecks },
    { name: "Applications", href: "/dashboard/applications", icon: Inbox },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ],
  collaborator: [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Browse Opportunities", href: "/opportunities", icon: Search },
    { name: "My Applications", href: "/dashboard/my-applications", icon: FileText },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ],
  admin: [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Manage Users", href: "/dashboard/manage-users", icon: Users },
    { name: "Manage Startups", href: "/dashboard/manage-startups", icon: Building2 },
    { name: "Transactions", href: "/dashboard/transactions", icon: CreditCard },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ],
};

const roleLabel = { founder: "Founder", collaborator: "Collaborator", admin: "Admin" };

export default function DashboardShell({ user, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const links = MENUS[user.role] || MENUS.collaborator;

  const isActive = (href) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));

  const handleLogout = async () => {
    await fetch("/api/token", { method: "DELETE", credentials: "same-origin" }).catch(() => {});
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-white">
      {/* User profile section */}
      <div className="flex items-center gap-3 border-b border-slate-200 p-4">
        <Avatar src={user.image} name={user.name} size={44} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
          <span className="mt-1 inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
            {roleLabel[user.role] || user.role}
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Dashboard">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-indigo-600 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <DashboardUserContext.Provider value={user}>
      <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
        {/* Desktop sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200 lg:block">
          {sidebar}
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] shadow-xl">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="absolute right-2 top-2 rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
              {sidebar}
            </aside>
          </div>
        )}

        <div className="min-w-0 flex-1">
          {/* Mobile top bar */}
          <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="rounded-md border border-slate-300 p-2 text-slate-700"
            >
              <Menu size={20} />
            </button>
            <span className="text-sm font-semibold text-slate-800">{roleLabel[user.role]} dashboard</span>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </div>
    </DashboardUserContext.Provider>
  );
}
