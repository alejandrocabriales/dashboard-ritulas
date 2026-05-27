// Nombre fijo de la cookie de sesión. NO se lee de env: el middleware corre en
// el runtime Edge (el valor se "inlinea" en build) y la Server Action corre en
// Node (lee en runtime). Si vinieran de env y los valores difirieran, el
// middleware buscaría una cookie con un nombre distinto del que escribió el
// login → loop de login. Un literal garantiza que ambos lados coincidan.
export const AUTH_COOKIE_NAME = "session";
