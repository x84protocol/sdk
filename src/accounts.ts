import { PublicKey } from "@solana/web3.js";
import { BN } from "./anchor-compat";
import type { X84Program } from "./types";
import { ServiceType, serviceTypeToSeed } from "./types";
import {
  findConfigPda,
  findAgentPda,
  findServicePda,
  findFeedbackPda,
  findDelegationPda,
  findPaymentReqPda,
} from "./pda";

// ── Single Account Fetchers ─────────────────────────────────────────

/**
 * Fetch the ProtocolConfig account.
 */
export async function fetchProtocolConfig(program: X84Program) {
  const [pda] = findConfigPda(program.programId);
  return program.account.protocolConfig.fetch(pda);
}

/**
 * Fetch an AgentIdentity account by NFT mint.
 */
export async function fetchAgentIdentity(
  program: X84Program,
  nftMint: PublicKey
) {
  const [pda] = findAgentPda(nftMint, program.programId);
  return program.account.agentIdentity.fetch(pda);
}

/**
 * Fetch an AgentIdentity account, returning null if it doesn't exist.
 */
export async function fetchAgentIdentityOrNull(
  program: X84Program,
  nftMint: PublicKey
) {
  const [pda] = findAgentPda(nftMint, program.programId);
  return program.account.agentIdentity.fetchNullable(pda);
}

/**
 * Fetch an AgentService account.
 */
export async function fetchService(
  program: X84Program,
  nftMint: PublicKey,
  serviceType: ServiceType
) {
  const seed = serviceTypeToSeed(serviceType);
  const [pda] = findServicePda(nftMint, seed, program.programId);
  return program.account.agentService.fetch(pda);
}

/**
 * Fetch a FeedbackEntry account.
 */
export async function fetchFeedbackEntry(
  program: X84Program,
  nftMint: PublicKey,
  reviewer: PublicKey,
  feedbackNonce: BN
) {
  const [pda] = findFeedbackPda(nftMint, reviewer, feedbackNonce, program.programId);
  return program.account.feedbackEntry.fetch(pda);
}

/**
 * Fetch a Delegation account by PDA components.
 */
export async function fetchDelegation(
  program: X84Program,
  delegator: PublicKey,
  delegate: PublicKey,
  delegationId: BN
) {
  const [pda] = findDelegationPda(delegator, delegate, delegationId, program.programId);
  return program.account.delegation.fetch(pda);
}

/**
 * Fetch a Delegation account by its PDA address directly.
 */
export async function fetchDelegationByPda(
  program: X84Program,
  delegationPda: PublicKey
) {
  return program.account.delegation.fetch(delegationPda);
}

/**
 * Fetch a PaymentRequirement account.
 */
export async function fetchPaymentRequirement(
  program: X84Program,
  nftMint: PublicKey,
  serviceType: ServiceType
) {
  const seed = serviceTypeToSeed(serviceType);
  const [pda] = findPaymentReqPda(nftMint, seed, program.programId);
  return program.account.paymentRequirement.fetch(pda);
}

// ── Batch Fetchers (getProgramAccounts) ─────────────────────────────

/**
 * Fetch all AgentIdentity accounts.
 */
export async function fetchAllAgents(program: X84Program) {
  return program.account.agentIdentity.all();
}

/**
 * Fetch all AgentIdentity accounts owned by a specific wallet.
 * Filters by the `owner` field (offset 40: 8 discriminator + 32 nft_mint).
 */
export async function fetchAgentsByOwner(
  program: X84Program,
  owner: PublicKey
) {
  return program.account.agentIdentity.all([
    { memcmp: { offset: 40, bytes: owner.toBase58() } },
  ]);
}

/**
 * Fetch all services for a specific agent.
 * Filters by the `nft_mint` field (offset 8: 8 discriminator).
 */
export async function fetchServicesByAgent(
  program: X84Program,
  nftMint: PublicKey
) {
  return program.account.agentService.all([
    { memcmp: { offset: 8, bytes: nftMint.toBase58() } },
  ]);
}

/**
 * Fetch all FeedbackEntry accounts for a specific agent.
 * Filters by the `nft_mint` field (offset 8: 8 discriminator).
 */
export async function fetchFeedbacksByAgent(
  program: X84Program,
  nftMint: PublicKey
) {
  return program.account.feedbackEntry.all([
    { memcmp: { offset: 8, bytes: nftMint.toBase58() } },
  ]);
}

/**
 * Fetch all delegations where a specific pubkey is the delegate.
 * Filters by the `delegate` field (offset 48: 8 discriminator + 8 delegation_id + 32 delegator).
 */
export async function fetchDelegationsByDelegate(
  program: X84Program,
  delegate: PublicKey
) {
  return program.account.delegation.all([
    { memcmp: { offset: 48, bytes: delegate.toBase58() } },
  ]);
}

/**
 * Fetch all delegations for a specific agent.
 * Filters by the `nft_mint` field (offset 80: 8 discriminator + 8 delegation_id + 32 delegator + 32 delegate).
 */
export async function fetchDelegationsByAgent(
  program: X84Program,
  nftMint: PublicKey
) {
  return program.account.delegation.all([
    { memcmp: { offset: 80, bytes: nftMint.toBase58() } },
  ]);
}
