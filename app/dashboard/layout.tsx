import Link from "next/link";
import { cookies } from "next/headers";
import { LogOut, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { verifySessionToken } from "@/lib/session";
import { logout } from "@/app/login/actions";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // El middleware ya garantiza sesión válida aquí; leemos el payload solo para
  // mostrar a quién pertenece (name, con fallback al email del JWT).
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  const userLabel =
    (session?.name as string | undefined) ?? (session?.email as string | undefined) ?? null;

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

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 md:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5" />
              Session protected
            </span>
            {userLabel && (
              <span className="hidden text-sm text-slate-600 sm:inline">{userLabel}</span>
            )}
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <LogOut className="h-3.5 w-3.5" />
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <main>{children}</main>
      </div>
    </div>
  );
}
