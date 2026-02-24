import { PublicKey } from "@solana/web3.js";
import { BN } from "./anchor-compat";
import { SEEDS, X84_PROGRAM_ID } from "./constants";

/**
 * Derive the ProtocolConfig PDA.
 * Seeds: ["config"]
 */
export function findConfigPda(
  programId: PublicKey = X84_PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.CONFIG)],
    programId
  );
}

/**
 * Derive an AgentIdentity PDA from the NFT mint.
 * Seeds: ["agent", nft_mint]
 */
export function findAgentPda(
  nftMint: PublicKey,
  programId: PublicKey = X84_PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.AGENT), nftMint.toBuffer()],
    programId
  );
}

/**
 * Derive an AgentService PDA.
 * Seeds: ["service", nft_mint, service_type_seed]
 * @param serviceTypeSeed - One of "mcp", "a2a", "api", "web"
 */
export function findServicePda(
  nftMint: PublicKey,
  serviceTypeSeed: string,
  programId: PublicKey = X84_PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(SEEDS.SERVICE),
      nftMint.toBuffer(),
      Buffer.from(serviceTypeSeed),
    ],
    programId
  );
}

/**
 * Derive a FeedbackEntry PDA.
 * Seeds: ["feedback", nft_mint, reviewer, nonce_le_bytes]
 */
export function findFeedbackPda(
  nftMint: PublicKey,
  reviewer: PublicKey,
  feedbackNonce: BN,
  programId: PublicKey = X84_PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(SEEDS.FEEDBACK),
      nftMint.toBuffer(),
      reviewer.toBuffer(),
      feedbackNonce.toArrayLike(Buffer, "le", 8),
    ],
    programId
  );
}

/**
 * Derive a ValidationRequest PDA.
 * Seeds: ["val_request", nft_mint, validator, request_hash[0..8]]
 */
export function findValidationRequestPda(
  nftMint: PublicKey,
  validator: PublicKey,
  requestHash: Uint8Array,
  programId: PublicKey = X84_PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(SEEDS.VAL_REQUEST),
      nftMint.toBuffer(),
      validator.toBuffer(),
      Buffer.from(requestHash.slice(0, 8)),
    ],
    programId
  );
}

/**
 * Derive a ValidationResponse PDA.
 * Seeds: ["val_response", nft_mint, validator, request_hash[0..8]]
 */
export function findValidationResponsePda(
  nftMint: PublicKey,
  validator: PublicKey,
  requestHash: Uint8Array,
  programId: PublicKey = X84_PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(SEEDS.VAL_RESPONSE),
      nftMint.toBuffer(),
      validator.toBuffer(),
      Buffer.from(requestHash.slice(0, 8)),
    ],
    programId
  );
}

/**
 * Derive a Delegation PDA.
 * Seeds: ["delegation", delegator, delegate, delegation_id_le_bytes]
 */
export function findDelegationPda(
  delegator: PublicKey,
  delegate: PublicKey,
  delegationId: BN,
  programId: PublicKey = X84_PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(SEEDS.DELEGATION),
      delegator.toBuffer(),
      delegate.toBuffer(),
      delegationId.toArrayLike(Buffer, "le", 8),
    ],
    programId
  );
}

/**
 * Derive a PaymentRequirement PDA.
 * Seeds: ["payment_req", nft_mint, service_type_seed]
 */
export function findPaymentReqPda(
  nftMint: PublicKey,
  serviceTypeSeed: string,
  programId: PublicKey = X84_PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(SEEDS.PAYMENT_REQ),
      nftMint.toBuffer(),
      Buffer.from(serviceTypeSeed),
    ],
    programId
  );
}

/**
 * Derive a PaymentReceipt PDA.
 * Seeds: ["receipt", payment_id]
 */
export function findReceiptPda(
  paymentId: Uint8Array,
  programId: PublicKey = X84_PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.RECEIPT), Buffer.from(paymentId)],
    programId
  );
}

/**
 * Derive a Delegation Vault PDA (token account).
 * Seeds: ["delegation_vault", delegation_pda]
 */
export function findVaultPda(
  delegationPda: PublicKey,
  programId: PublicKey = X84_PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.DELEGATION_VAULT), delegationPda.toBuffer()],
    programId
  );
}

/**
 * Derive a Vault Authority PDA.
 * Seeds: ["vault_authority", delegation_pda]
 */
export function findVaultAuthorityPda(
  delegationPda: PublicKey,
  programId: PublicKey = X84_PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.VAULT_AUTHORITY), delegationPda.toBuffer()],
    programId
  );
}

