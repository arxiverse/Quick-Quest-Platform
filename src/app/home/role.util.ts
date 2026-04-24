// Menggunakan cyrb53 untuk Synchronous Hashing 53-bit (Kencang & Kompak)
// Ini memenuhi requirement "Key & Value full hash" agar data di LocalStorage tidak mudah diutak-atik.

const SEED = 0x8a2f;

export function generateHash(str: string): string {
  let h1 = 0xdeadbeef ^ SEED,
    h2 = 0x41c6ce57 ^ SEED;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, "0");
}

// Type Role — didefinisikan disini supaya tidak circular import antara role.ts & role.context.tsx
export type RoleMode = "runner" | "giver";
export type BackendUserRole = "user_runner" | "user_unlocked";

// Konstan Hash Keys
export const LS_ROLE_KEY = generateHash("QQM_ACTIVE_ROLE_STATE");
export const HASH_RUNNER = generateHash("QQM_STATE_RUNNER");
export const HASH_GIVER = generateHash("QQM_STATE_GIVER");

// Konstan Access Keys (Status Verifikasi KTP / Giver Unlock)
export const LS_VERIFIED_KEY = generateHash("QQM_GIVER_VERIFIED_STATE");
export const HASH_GRANTED = generateHash("QQM_ACCESS_GRANTED");

// Marker unlock dari backend — user_role = "user_unlocked"
export const HASH_UNLOCKED = generateHash("QQM_STATE_UNLOCKED");

// Set nilai VALID untuk LS_ROLE_KEY — value lain = tamper, trigger force logout
export const VALID_ROLE_HASHES = new Set([HASH_RUNNER, HASH_GIVER]);

export function normalizeBackendUserRole(value: string): BackendUserRole {
  return value === "user_unlocked" ? "user_unlocked" : "user_runner";
}
