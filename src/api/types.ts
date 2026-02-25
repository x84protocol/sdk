// ── Network & Config ──

export type X84Network = "mainnet" | "devnet";

export interface X84ApiClientConfig {
  /** Override the base URL entirely. Takes precedence over `network`. */
  baseUrl?: string;
  /** Select network preset. Defaults to `"mainnet"`. */
  network?: X84Network;
}

// ── Pagination ──

export interface PaginatedResponse<T> {
  data: T[];
  cursor: {
    next: string | null;
    hasMore: boolean;
  };
}

// ── Discovery: Agents ──

export interface ListAgentsParams {
  cursor?: string;
  limit?: number;
  q?: string;
  category?: string;
  active?: boolean;
  owner?: string;
}

export interface AgentListItem {
  nftMint: string;
  owner: string;
  metadataUri?: string;
  categories?: string[];
  active: boolean;
  reputation: ReputationSummary;
}

export interface AgentDetail extends AgentListItem {
  address: string;
  ownerVersion: number;
  feedbackAuthority: string;
  metadataHash?: string;
  tags?: string[];
  delegationCount: number;
  services: AgentService[];
}

// ── Discovery: Services ──

export interface GetAgentServicesParams {
  serviceType?: string;
  active?: boolean;
}

export interface AgentService {
  address: string;
  serviceType: string;
  endpoint?: string;
  version?: string;
  active: boolean;
}

// ── Discovery: Feedback ──

export interface GetAgentFeedbackParams {
  reviewer?: string;
  verified?: boolean;
}

export interface FeedbackEntry {
  address: string;
  reviewer: string;
  score: number;
  detailUri: string;
  tag1: string;
  tag2: string;
  authVerified: boolean;
  hasPaymentProof: boolean;
  paymentAmount: number;
  paymentToken: string;
  createdAt?: string;
}

// ── Discovery: Categories ──

export interface Category {
  name: string;
  hash: string;
}

// ── Discovery: Reputation ──

export interface ReputationSummary {
  verifiedCount: number;
  verifiedAvgScore: number;
  unverifiedCount: number;
  unverifiedAvgScore: number;
  validationCount: number;
}

// ── Registration ──

export interface RegisterAgentParams {
  name: string;
  ownerAddress: string;
  metadataUri: string;
  tags?: string[];
}

export interface RegisterAgentResponse {
  /** Base64-encoded serialized transaction (partially signed by co-signer) */
  transaction: string;
  assetPublicKey: string;
  agentPda: string;
  blockhash: string;
  lastValidBlockHeight: number;
}
