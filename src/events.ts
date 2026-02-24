import { PublicKey, Connection } from "@solana/web3.js";
import { EventParser } from "./anchor-compat";
import type { X84Program } from "./types";

// ── Event Types (matching on-chain events.rs) ───────────────────────

export interface AgentRegisteredEvent {
  nftMint: PublicKey;
  owner: PublicKey;
  metadataUri: string;
  feedbackAuthority: PublicKey;
  tags: number[][];
  timestamp: bigint;
}

export interface MetadataUpdatedEvent {
  nftMint: PublicKey;
  oldHash: number[];
  newHash: number[];
  newUri: string;
  updatedBy: PublicKey;
  viaDelegation: boolean;
  timestamp: bigint;
}

export interface AgentDeactivatedEvent {
  nftMint: PublicKey;
  timestamp: bigint;
}

export interface AgentReactivatedEvent {
  nftMint: PublicKey;
  timestamp: bigint;
}

export interface AgentClaimedEvent {
  nftMint: PublicKey;
  oldOwner: PublicKey;
  newOwner: PublicKey;
  newOwnerVersion: bigint;
  timestamp: bigint;
}

export interface FeedbackAuthorityUpdatedEvent {
  nftMint: PublicKey;
  oldAuthority: PublicKey;
  newAuthority: PublicKey;
  timestamp: bigint;
}

export interface ServiceAddedEvent {
  nftMint: PublicKey;
  serviceType: unknown;
  endpoint: string;
  timestamp: bigint;
}

export interface ServiceUpdatedEvent {
  nftMint: PublicKey;
  serviceType: unknown;
  newEndpoint: string;
  timestamp: bigint;
}

export interface ServiceRemovedEvent {
  nftMint: PublicKey;
  serviceType: unknown;
  timestamp: bigint;
}

export interface FeedbackGivenEvent {
  nftMint: PublicKey;
  reviewer: PublicKey;
  score: number;
  tag1: number[];
  tag2: number[];
  hasPaymentProof: boolean;
  paymentAmount: bigint;
  detailUri: string;
  detailHash: number[];
  feedbackAuth: number[];
  timestamp: bigint;
}

export interface FeedbackRevokedEvent {
  nftMint: PublicKey;
  reviewer: PublicKey;
  timestamp: bigint;
}

export interface ValidationRequestedEvent {
  nftMint: PublicKey;
  validator: PublicKey;
  requestHash: number[];
  tag: number[];
  requestUri: string;
  timestamp: bigint;
}

export interface ValidationRespondedEvent {
  nftMint: PublicKey;
  validator: PublicKey;
  requestHash: number[];
  score: number;
  tag: number[];
  evidenceUri: string;
  evidenceHash: number[];
  timestamp: bigint;
}

export interface DelegationCreatedEvent {
  nftMint: PublicKey;
  delegator: PublicKey;
  delegate: PublicKey;
  delegationId: bigint;
  depth: number;
  expiresAt: bigint;
  maxSpendTotal: bigint;
  ownerVersion: bigint;
  isSubDelegation: boolean;
  timestamp: bigint;
}

export interface DelegationRevokedEvent {
  nftMint: PublicKey;
  delegator: PublicKey;
  delegate: PublicKey;
  delegationId: bigint;
  timestamp: bigint;
}

export interface PaymentRequirementSetEvent {
  nftMint: PublicKey;
  serviceType: unknown;
  scheme: unknown;
  amount: bigint;
  tokenMint: PublicKey;
  timestamp: bigint;
}

export interface PaymentSettledEvent {
  paymentId: number[];
  nftMint: PublicKey;
  payer: PublicKey;
  payee: PublicKey;
  amount: bigint;
  feeAmount: bigint;
  tokenMint: PublicKey;
  resource: string;
  settlementMode: unknown;
  delegation: PublicKey | null;
  delegationSpentTotal: bigint | null;
  timestamp: bigint;
}

export type X84Event =
  | { name: "agentRegistered"; data: AgentRegisteredEvent }
  | { name: "metadataUpdated"; data: MetadataUpdatedEvent }
  | { name: "agentDeactivated"; data: AgentDeactivatedEvent }
  | { name: "agentReactivated"; data: AgentReactivatedEvent }
  | { name: "agentClaimed"; data: AgentClaimedEvent }
  | { name: "feedbackAuthorityUpdated"; data: FeedbackAuthorityUpdatedEvent }
  | { name: "serviceAdded"; data: ServiceAddedEvent }
  | { name: "serviceUpdated"; data: ServiceUpdatedEvent }
  | { name: "serviceRemoved"; data: ServiceRemovedEvent }
  | { name: "feedbackGiven"; data: FeedbackGivenEvent }
  | { name: "feedbackRevoked"; data: FeedbackRevokedEvent }
  | { name: "validationRequested"; data: ValidationRequestedEvent }
  | { name: "validationResponded"; data: ValidationRespondedEvent }
  | { name: "delegationCreated"; data: DelegationCreatedEvent }
  | { name: "delegationRevoked"; data: DelegationRevokedEvent }
  | { name: "paymentRequirementSet"; data: PaymentRequirementSetEvent }
  | { name: "paymentSettled"; data: PaymentSettledEvent };

// ── Event Parsing ───────────────────────────────────────────────────

/**
 * Parse x84 events from transaction log messages.
 * Anchor's EventParser returns camelCase event names.
 */
export function parseEventsFromLogs(
  program: X84Program,
  logs: string[]
): X84Event[] {
  const parser = new EventParser(program.programId, program.coder);
  const events: X84Event[] = [];

  for (const event of parser.parseLogs(logs)) {
    events.push({ name: event.name, data: event.data } as X84Event);
  }

  return events;
}

/**
 * Parse x84 events from a confirmed transaction signature.
 */
export async function parseEventsFromTx(
  program: X84Program,
  connection: Connection,
  txSignature: string
): Promise<X84Event[]> {
  const tx = await connection.getTransaction(txSignature, {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0,
  });

  if (!tx?.meta?.logMessages) return [];

  return parseEventsFromLogs(program, tx.meta.logMessages);
}

/**
 * Find a specific event type from a list of parsed events.
 */
export function findEvent(
  events: X84Event[],
  name: X84Event["name"]
): unknown | null {
  const found = events.find((e) => e.name === name);
  return found ? found.data : null;
}
