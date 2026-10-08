import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Startups", href: "/startups" },
  { name: "Browse Opportunities", href: "/opportunities" },
  { name: "Login", href: "/login" },
  { name: "Register", href: "/register" },
];

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com" },
  { name: "X (Twitter)", href: "https://x.com" },
  { name: "LinkedIn", href: "https://linkedin.com" },
  { name: "GitHub", href: "https://github.com" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Logo + about */}
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold text-white">
              S
            </span>
            <span className="text-xl font-bold text-white">
              Startup<span className="text-indigo-400">Forge</span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            A platform where founders build teams and collaborators find startups worth joining.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-sm font-semibold text-white">Quick links</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social links */}
        <div>
          <h3 className="text-sm font-semibold text-white">Follow us</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {socialLinks.map((l) => (
              <li key={l.name}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {l.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-indigo-400" /> support@startupforge.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-indigo-400" /> +880 1700-000000
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="shrink-0 text-indigo-400" /> Dhaka, Bangladesh
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800 py-5 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} StartupForge. All rights reserved.
      </div>
    </footer>
  );
}