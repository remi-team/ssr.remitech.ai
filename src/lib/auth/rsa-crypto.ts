import "server-only";

import { createPublicKey, publicEncrypt, constants } from "node:crypto";

/**
 * Server-side RSA password encryption — mirrors the legacy Vue client-side
 * `encryptPassword()` from `crypto.ts` (JSEncrypt, PKCS#1 v1.5 padding).
 *
 * In the BFF architecture the client sends the plain password to the BFF over
 * HTTPS (same-origin); the BFF then encrypts it with the same RSA public key
 * before forwarding to the website API, which expects an RSA-encrypted password
 * (decrypted server-side with the private key).
 *
 * The public key is a **public** key (not a secret), so it is safe to bake in
 * as a fallback. Environments may override it via `WEBSITE_API_RSA_PUBLIC_KEY`.
 */

const DEFAULT_RSA_PUBLIC_KEY = [
  "-----BEGIN PUBLIC KEY-----",
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0SZvIYIlApR5L0ynqAlS",
  "aki2rAd7yO7R5DtUcV9xdKjCBIqlJXehhGWiJBEHSarCYA6qTsKZ826WrrG/03gA",
  "Znum0w0owaXswxy8hff05yA7VsiSEe/+jZm3mwueTfB6ikJoKzV3iPIH7QUbya2+",
  "a/mU3COTzk1yfkUsmO3+R9861nRRo/A7jZkcaMABTe1q+UsjSziP1s4aKrjpJRuP",
  "vzMIHcxD8b01oAFJyoEMg9C0QT6yGiPZW8cTwmzg7/6ijTPNvDB/m1YsF0V6wF7K",
  "tzQyNMXzE/sOI4NGNXqvchqgM4LwQM8mtnQSWNEiSmjHBE3IONT2f2UGRnp/oYlL",
  "TwIDAQAB",
  "-----END PUBLIC KEY-----",
].join("\n");

/**
 * Resolve the RSA public key PEM from env (normalising literal `\n` sequences
 * and surrounding quotes) with a fallback to the built-in default.
 */
function getPublicKeyPem(): string {
  const raw = process.env.WEBSITE_API_RSA_PUBLIC_KEY ?? DEFAULT_RSA_PUBLIC_KEY;
  return raw.replace(/\\n/g, "\n").replace(/^"|"$/g, "");
}

/** Cached KeyObject — avoids re-parsing the PEM on every request. */
let cachedKey: ReturnType<typeof createPublicKey> | null = null;

function getKey() {
  if (!cachedKey) {
    cachedKey = createPublicKey(getPublicKeyPem());
  }
  return cachedKey;
}

/**
 * Encrypt a plain string with RSA PKCS#1 v1.5 padding (same as JSEncrypt's
 * default). Returns a Base64-encoded ciphertext.
 */
export function encryptWithRsa(plain: string): string {
  const encrypted = publicEncrypt(
    {
      key: getKey(),
      padding: constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(plain, "utf8"),
  );
  return encrypted.toString("base64");
}

/**
 * Encrypt a password for the website API — the exact equivalent of the legacy
 * `encryptPassword()`. Throws if encryption fails.
 */
export function encryptPassword(plain: string): string {
  return encryptWithRsa(plain);
}
