import { PublicKey } from "@solana/web3.js";

export const X84_PROGRAM_ID = new PublicKey(
  "X84XHMKT7xvjgVUXFNQLZLSdCEEZu2wAPrAeP4M9Hhi"
);

export const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
);

/** PDA seed prefixes (must match on-chain constants). */
export const SEEDS = {
  CONFIG: "config",
  AGENT: "agent",
  SERVICE: "service",
  FEEDBACK: "feedback",
  VAL_REQUEST: "val_request",
  VAL_RESPONSE: "val_response",
  DELEGATION: "delegation",
  PAYMENT_REQ: "payment_req",
  RECEIPT: "receipt",
  DELEGATION_VAULT: "delegation_vault",
  VAULT_AUTHORITY: "vault_authority",
} as const;

/** Service type seed strings (must match on-chain ServiceType::seed()). */
export const SERVICE_TYPE_SEEDS = {
  MCP: "mcp",
  A2A: "a2a",
  API: "api",
  Web: "web",
} as const;

/** Default registration fee in lamports (0.05 SOL). */
export const DEFAULT_REGISTRATION_FEE = 50_000_000;

/** Default settlement fee in basis points (300 = 3%). */
export const DEFAULT_SETTLEMENT_FEE_BPS = 300;

/** Maximum settlement fee in basis points (1000 = 10%). */
export const MAX_SETTLEMENT_FEE_BPS = 1000;

// ── Per-Network Deployment Config ────────────────────────────────────
//
// All values below are set after running `program/scripts/initialize.ts`.
// They are deterministic or fixed once the protocol is deployed on a network.
//
// After deploying, copy values from `program/deployments/<network>.json`
// into the appropriate network config here.

export interface NetworkConfig {
  programId: PublicKey;
  /** Collection NFT mint (created during initialize). */
  collection: PublicKey | null;
  /** Fee treasury wallet (set during initialize, changeable via updateConfig). */
  feeTreasury: PublicKey | null;
  /** Token mint used for payments (e.g. USDC). */
  tokenMint: PublicKey | null;
  /** Treasury's token account for receiving protocol fees. */
  treasuryTokenAccount: PublicKey | null;
  /** Facilitator signer for delegated/attestation settlement. */
  facilitator: PublicKey | null;
}

export const NETWORKS: Record<string, NetworkConfig> = {
  devnet: {
    programId: X84_PROGRAM_ID,
    collection: new PublicKey("6s1irFAQHoiK7VLwrUQEGpN5E1MrLoo5dZVWZCAwsDZS"),
    feeTreasury: new PublicKey("8VF2ZAp9C1RKeV2XmKBnCQdbhGuNZaLZ1x7mTCSGsMH9"),
    tokenMint: new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"),
    treasuryTokenAccount: new PublicKey("95zdnDqXimbSosFxEwAKamp2E5rKHp9N1rXmsU1Bn4v1"),
    facilitator: new PublicKey("7iRiHRnj1NofyEZVuj86Z4s5MJwVFZVR71XuAsLnwLYX"),
  },
  mainnet: {
    programId: X84_PROGRAM_ID,
    collection: null,
    feeTreasury: null,
    tokenMint: null,
    treasuryTokenAccount: null,
    facilitator: null,
  },
};

/**
 * Get the deployment config for a network.
 * Throws if the network hasn't been deployed yet (null values).
 */
export function getNetworkConfig(network: "devnet" | "mainnet"): NetworkConfig {
  const config = NETWORKS[network];
  if (!config) throw new Error(`Unknown network: ${network}`);
  return config;
}
