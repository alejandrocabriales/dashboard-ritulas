import { SignJWT, jwtVerify, type JWTPayload } from "jose";

// Firma/verificación del JWT de sesión. Módulo PURO: solo usa `jose` (que
// funciona en Edge y Node) y `process.env`. No importa `next/headers`, así el
// middleware (Edge) puede importarlo sin arrastrar APIs solo-Node.

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET no está configurado");
  }
  return new TextEncoder().encode(secret);
}

// Firma un JWT HS256 con expiración de 1 día.
export async function signSession(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(getSecret());
}

// Verifica firma + expiración. Devuelve el payload si es válido, null si no.
// Nunca lanza: token ausente, manipulado o vencido → null.
export async function verifySessionToken(
  token: string | undefined,
): Promise<JWTPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}
