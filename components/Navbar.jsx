"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LayoutDashboard, User, LogOut, ChevronDown } from "lucide-react";
import { authClient } from "../lib/auth-client"; // Better Auth client
import { Avatar } from "./ui";

const publicLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Startups", href: "/startups" },
  { name: "Browse Opportunities", href: "/opportunities" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false); // mobile menu
  const [dropdown, setDropdown] = useState(false); // profile dropdown

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    // remove the JWT cookie first, then end the Better Auth session
    await fetch("/api/token", { method: "DELETE", credentials: "same-origin" }).catch(() => {});
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setDropdown(false);
          setOpen(false);
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const linkClass = (href) =>
    `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      pathname === href
        ? "text-indigo-600 bg-indigo-50"
        : "text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold text-white">
            S
          </span>
          <span className="text-xl font-bold text-slate-900">
            Startup<span className="text-indigo-600">Forge</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {publicLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.name}
            </Link>
          ))}
          {user && (
            <Link href="/dashboard" className={linkClass("/dashboard")}>
              Dashboard
            </Link>
          )}
        </div>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-slate-200" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setDropdown(!dropdown)}
                className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 hover:bg-slate-50"
                aria-haspopup="true"
                aria-expanded={dropdown}
              >
                <Avatar src={user.image} name={user.name || "User"} size={32} />
                <span className="max-w-[100px] truncate text-sm font-medium text-slate-700">{user.name}</span>
                <ChevronDown size={16} className="text-slate-500" />
              </button>

              {dropdown && (
                <div className="absolute right-0 mt-2 w-52 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdown(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setDropdown(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <User size={16} /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {publicLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={linkClass(link.href)}>
                {link.name}
              </Link>
            ))}

            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className={linkClass("/dashboard")}>
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className={linkClass("/dashboard/profile")}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="mt-2 rounded-md bg-red-50 px-3 py-2 text-left text-sm font-medium text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="mt-2 flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
