import { sha256 } from "@noble/hashes/sha256";

/**
 * Hash a tag string to a 32-byte array using SHA-256.
 * Browser-safe (uses @noble/hashes, no Node.js crypto).
 */
export function hashTag(tag: string): number[] {
  const hash = sha256(new TextEncoder().encode(tag));
  return Array.from(hash);
}

/**
 * Hash arbitrary bytes using SHA-256.
 * Returns a 32-byte array.
 */
export function hashBytes(data: Uint8Array): number[] {
  return Array.from(sha256(data));
}

/** Create a 32-byte zero-filled array. */
export function zeroBytes32(): number[] {
  return new Array(32).fill(0);
}

/** Create a 64-byte zero-filled array. */
export function zeroBytes64(): number[] {
  return new Array(64).fill(0);
}

/**
 * Generate a random 32-byte payment ID.
 * Browser-safe (uses crypto.getRandomValues).
 */
export function randomPaymentId(): number[] {
  const buf = new Uint8Array(32);
  globalThis.crypto.getRandomValues(buf);
  return Array.from(buf);
}

/**
 * Generate a random 64-byte signature placeholder.
 * Browser-safe.
 */
export function randomSignature(): number[] {
  const buf = new Uint8Array(64);
  globalThis.crypto.getRandomValues(buf);
  return Array.from(buf);
}

/**
 * Convert a string to a fixed 32-byte array, zero-padded.
 */
export function stringToBytes32(s: string): number[] {
  const encoded = new TextEncoder().encode(s);
  const buf = new Uint8Array(32);
  buf.set(encoded.slice(0, 32));
  return Array.from(buf);
}
