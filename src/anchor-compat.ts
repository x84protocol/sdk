// CJS/ESM interop shim for @coral-xyz/anchor
// @coral-xyz/anchor is a CJS module — named imports break in ESM-strict
// environments (e.g. Next.js Turbopack). This module re-exports via default import.

import anchor from "@coral-xyz/anchor";

export const BN = anchor.BN;
export type BN = InstanceType<typeof anchor.BN>;

export const EventParser = anchor.EventParser;
export type EventParser = InstanceType<typeof anchor.EventParser>;

export type Idl = anchor.Idl;
export type Program<T extends anchor.Idl = anchor.Idl> = anchor.Program<T>;
