"use server";

import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { signSession } from "@/lib/session";

export type LoginState =
  | { ok: true; next: string }
  | { ok: false; error: string }
  | null;

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const rawNext = (formData.get("next") as string) || "/dashboard/reservas";

  // Evita open-redirect: solo rutas internas ("/algo", no "//host" ni URLs).
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/dashboard/reservas";

  const adminEmail = process.env.ADMIN_EMAIL || "gcabriales@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "123456789";

  if (email !== adminEmail || password !== adminPassword) {
    return { ok: false, error: "Credenciales inválidas" };
  }

  const token = await signSession({ sub: email });

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    path: "/",
    maxAge: 86400,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  // NO usamos redirect() aquí: en Netlify el Set-Cookie se pierde en el 303 de
  // la Server Action → loop de login. Devolvemos ok y navegamos en el cliente,
  // donde el Set-Cookie viaja en un 200 normal que la CDN sí conserva.
  return { ok: true, next };
}
