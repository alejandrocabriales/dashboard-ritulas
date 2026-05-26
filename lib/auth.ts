import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "./constants";

export async function requireSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!session) {
    throw new Error("UNAUTHENTICATED");
  }

  return session;
}
