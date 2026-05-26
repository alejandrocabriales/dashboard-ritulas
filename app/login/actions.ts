"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nextPath = (formData.get("next") as string) || "/dashboard/reservas";

  const adminEmail = process.env.ADMIN_EMAIL || "gcabriales@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "123456789";

  if (email === adminEmail && password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, "admin-session", {
      path: "/",
      maxAge: 86400,
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    
    redirect(nextPath);
  }

  return { error: "Credenciales inválidas" };
}
