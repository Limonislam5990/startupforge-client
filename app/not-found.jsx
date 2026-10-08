import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      {/* Illustration */}
      <svg
        viewBox="0 0 400 220"
        className="h-48 w-full max-w-sm sm:h-56"
        role="img"
        aria-label="A rocket that missed its destination"
      >
        <circle cx="70" cy="40" r="3" fill="#a5b4fc" />
        <circle cx="330" cy="60" r="4" fill="#a5b4fc" />
        <circle cx="290" cy="170" r="3" fill="#a5b4fc" />
        <circle cx="110" cy="180" r="2.5" fill="#a5b4fc" />

        <text x="200" y="125" textAnchor="middle" fontSize="110" fontWeight="800" fill="#e0e7ff">
          404
        </text>

        <g transform="translate(200 60) rotate(35)">
          <path d="M0 -50 C 20 -30, 20 10, 12 30 L -12 30 C -20 10, -20 -30, 0 -50 Z" fill="#4f46e5" />
          <circle cx="0" cy="-12" r="8" fill="#e0e7ff" />
          <path d="M-12 30 L-26 44 L-12 14 Z" fill="#6366f1" />
          <path d="M12 30 L26 44 L12 14 Z" fill="#6366f1" />
          <path d="M-6 30 L0 52 L6 30 Z" fill="#fbbf24" />
        </g>
      </svg>

      <h1 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">Page not found</h1>
      <p className="mt-3 max-w-md text-slate-600">
        The page you are looking for does not exist or has been moved. Check the address or go back
        to the home page.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Back to home
      </Link>
    </main>
  );
}