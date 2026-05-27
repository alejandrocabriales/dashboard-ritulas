"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { signSession } from "@/lib/session";
import { loginToBackend } from "@/lib/api";

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

  // El backend es la única fuente de identidad (users reales con argon2). No hay
  // credenciales en env: si no hay usuario válido, no se entra.
  const result = await loginToBackend(email, password);

  if (!result.ok) {
    // 401/400 → credenciales (no filtramos cuál falló). 429 → throttle por email.
    // resto (red/5xx/sin BACKEND_URL → status 0) → fallo de conexión.
    const error =
      result.status === 401 || result.status === 400
        ? "Credenciales inválidas"
        : result.status === 429
          ? "Demasiados intentos, esperá unos minutos"
          : "No se pudo conectar, intentá de nuevo";
    return { ok: false, error };
  }

  const token = await signSession({
    sub: result.user.id,
    email: result.user.email,
    name: result.user.name,
  });

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

// Cierra sesión: borra la cookie y vuelve a /login. El redirect() aquí sí es
// seguro (no dependemos de conservar un Set-Cookie de alta a través del 303;
// borrar la cookie en el 303 funciona bien).
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect("/login");
}
