import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "./constants";
import { verifySessionToken } from "./session";

// Guard server-side (Server Actions / Route Handlers). Lee la cookie y verifica
// el JWT. Antes solo comprobaba que la cookie existiera, así que cualquier valor
// la pasaba; ahora exige firma válida y no vencida.
export async function requireSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    throw new Error("UNAUTHENTICATED");
  }

  return session;
}
