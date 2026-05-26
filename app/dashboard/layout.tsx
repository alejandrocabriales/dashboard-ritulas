import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/dashboard/reservas" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/15">
              R
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-950">Reservas Admin</p>
              <p className="text-xs text-slate-500">Backend-connected dashboard</p>
            </div>
          </Link>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5" />
              Session protected
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <main>{children}</main>
      </div>
    </div>
  );
}
