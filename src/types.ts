import { PublicKey } from "@solana/web3.js";
import { BN } from "./anchor-compat";
import type { Program } from "./anchor-compat";
import type { X84 } from "./idl/x84";

export type { X84 };
export type X84Program = Program<X84>;

// ── SDK-friendly Enums ────────────────────────────────────────────

export enum ServiceType {
  MCP = "mcp",
  A2A = "a2a",
  API = "api",
  Web = "web",
}

export enum PaymentScheme {
  Exact = "exact",
  UpTo = "upTo",
}

export enum SettlementMode {
  Atomic = "atomic",
  Attestation = "attestation",
  Delegated = "delegated",
}

// ── Anchor Enum Converters ────────────────────────────────────────
// Anchor IDL represents Rust enums as { variant: {} } objects.

export type AnchorServiceType =
  | { mcp: Record<string, never> }
  | { a2A: Record<string, never> }
  | { api: Record<string, never> }
  | { web: Record<string, never> };

export type AnchorPaymentScheme =
  | { exact: Record<string, never> }
  | { upTo: Record<string, never> };

export type AnchorSettlementMode =
  | { atomic: Record<string, never> }
  | { attestation: Record<string, never> }
  | { delegated: Record<string, never> };

export function toAnchorServiceType(t: ServiceType): AnchorServiceType {
  switch (t) {
    case ServiceType.MCP:
      return { mcp: {} };
    case ServiceType.A2A:
      return { a2A: {} };
    case ServiceType.API:
      return { api: {} };
    case ServiceType.Web:
      return { web: {} };
  }
}

export function toAnchorPaymentScheme(s: PaymentScheme): AnchorPaymentScheme {
  switch (s) {
    case PaymentScheme.Exact:
      return { exact: {} };
    case PaymentScheme.UpTo:
      return { upTo: {} };
  }
}

export function toAnchorSettlementMode(
  m: SettlementMode
): AnchorSettlementMode {
  switch (m) {
    case SettlementMode.Atomic:
      return { atomic: {} };
    case SettlementMode.Attestation:
      return { attestation: {} };
    case SettlementMode.Delegated:
      return { delegated: {} };
  }
}

/**
 * Convert a ServiceType to its PDA seed string.
 */
export function serviceTypeToSeed(serviceType: ServiceType): string {
  return serviceType as string;
}

/**
 * Convert an Anchor-style service type object to its PDA seed string.
 */
export function anchorServiceTypeToSeed(
  serviceType: AnchorServiceType
): string {
  if ("mcp" in serviceType) return "mcp";
  if ("a2A" in serviceType) return "a2a";
  if ("api" in serviceType) return "api";
  if ("web" in serviceType) return "web";
  throw new Error("Unknown service type");
}

// ── Delegation Permissions ────────────────────────────────────────

export interface DelegationPermissions {
  canTransact: boolean;
  canGiveFeedback: boolean;
  canUpdateMetadata: boolean;
  canUpdatePricing: boolean;
  canRegisterServices: boolean;
  canManage: boolean;
  canRedelegate: boolean;
}

export interface DelegationConstraints {
  maxSpendPerTx: BN;
  maxSpendTotal: BN;
  allowedTokens: PublicKey[];
  allowedPrograms: PublicKey[];
  expiresAt: BN;
  usesRemaining: BN;
}
