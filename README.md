# @x84-ai/sdk

TypeScript SDK for the x84 Solana protocol — register AI agents as NFTs, manage reputation, delegate authority, and settle x402 payments on-chain.

**Program ID:** `X84XHMKT7xvjgVUXFNQLZLSdCEEZu2wAPrAeP4M9Hhi`

## Install

```bash
pnpm add @x84-ai/sdk @coral-xyz/anchor @solana/web3.js @solana/spl-token
```

## Quick Start

```ts
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import { IDL, X84 } from "@x84-ai/sdk/idl";
import { NETWORKS, registerAgent, hashTag, hashBytes } from "@x84-ai/sdk";

const connection = new Connection(clusterApiUrl("devnet"));
const provider = new AnchorProvider(connection, wallet, {});
const config = NETWORKS.devnet;
const program = new Program<X84>(IDL, config.programId, provider);
```

## Modules

### Agent Identity

Register agents as Metaplex Core NFTs. The NFT mint pubkey **is** the agent ID.

```ts
import {
  registerAgent,
  updateAgentMetadata,
  deactivateAgent,
  reactivateAgent,
  claimAgent,
  setFeedbackAuthority,
} from "@x84-ai/sdk";

// Register a new agent (mints an NFT)
const { instruction, asset, agentPda } = await registerAgent(program, {
  name: "MyAgent",
  owner: wallet.publicKey,
  configAuthority: config.programId,
  metadataUri: "https://example.com/agent.json",
  metadataHash: hashBytes(Buffer.from("metadata")),
  feedbackAuthority: feedbackKeypair.publicKey,
  tags: ["speed", "quality"], // auto-hashed to [u8; 32]
  collection: config.collection,
  feeTreasury: config.feeTreasury,
});

// Update metadata (owner or delegate with canUpdateMetadata)
const { instruction } = await updateAgentMetadata(program, {
  caller: wallet.publicKey,
  nftMint: agentMint,
  newUri: "https://example.com/v2.json",
  newHash: hashBytes(Buffer.from("v2")),
});

// Deactivate / reactivate
await deactivateAgent(program, wallet.publicKey, agentMint);
await reactivateAgent(program, wallet.publicKey, agentMint);

// Claim after NFT transfer (invalidates all delegations)
await claimAgent(program, newOwner, agentMint);

// Change feedback authority
await setFeedbackAuthority(program, wallet.publicKey, agentMint, newAuthority);
```

### Service Catalog

Register service endpoints (MCP, A2A, API, Web) for your agent.

```ts
import {
  addService,
  updateService,
  removeService,
  ServiceType,
} from "@x84-ai/sdk";

// Add a service
const { instruction, servicePda } = await addService(program, {
  caller: wallet.publicKey,
  nftMint: agentMint,
  serviceType: ServiceType.A2A,
  endpoint: "https://agent.x84.ai/.well-known/agent-card.json",
  version: "1.0.0",
});

// Update endpoint
await updateService(program, {
  caller: wallet.publicKey,
  nftMint: agentMint,
  serviceType: ServiceType.A2A,
  newEndpoint: "https://v2.agent.x84.ai/agent-card.json",
});

// Remove service (closes PDA, returns rent)
await removeService(program, {
  caller: wallet.publicKey,
  nftMint: agentMint,
  serviceType: ServiceType.A2A,
});
```

### Reputation & Feedback

Submit scored feedback with Ed25519 authority verification. Feedback linked to payment receipts carries higher weight (verified vs unverified).

```ts
import { giveFeedback, revokeFeedback, hashTag, zeroBytes32 } from "@x84-ai/sdk";

// Submit feedback (score 0-100)
const { ed25519Instruction, instruction, feedbackPda } = await giveFeedback(
  program,
  {
    reviewer: wallet.publicKey,
    nftMint: agentMint,
    score: 92,
    tag1: hashTag("reliability"),
    tag2: hashTag("speed"),
    detailUri: "https://example.com/review.json",
    detailHash: zeroBytes32(),
    feedbackAuth: zeroBytes64(),
    feedbackNonce: new BN(0),
    paymentReceipt: receiptPda, // optional — links to payment proof
  },
  feedbackAuthoritySecret // optional — auto-builds Ed25519 verify ix
);

// If ed25519Instruction exists, it MUST precede the feedback ix in the tx
const tx = new Transaction();
if (ed25519Instruction) tx.add(ed25519Instruction);
tx.add(instruction);

// Revoke your own feedback
await revokeFeedback(program, {
  reviewer: wallet.publicKey,
  nftMint: agentMint,
  feedbackNonce: new BN(0),
});
```

### Validation

Two-step quality assurance: request validation from a designated validator, who responds with a score and evidence.

```ts
import { validationRequest, validationResponse, hashBytes } from "@x84-ai/sdk";

// Request validation
const { instruction, validationRequestPda } = await validationRequest(program, {
  caller: wallet.publicKey,
  nftMint: agentMint,
  validator: validatorPubkey,
  requestHash: hashBytes(Buffer.from("audit-v1")),
  tag: hashTag("security"),
  requestUri: "https://example.com/audit-request.json",
});

// Validator responds (only designated validator can call)
const { instruction, validationResponsePda } = await validationResponse(program, {
  validator: validatorPubkey,
  nftMint: agentMint,
  requestHash: hashBytes(Buffer.from("audit-v1")),
  score: 88,
  tag: hashTag("security"),
  evidenceUri: "https://example.com/audit-result.json",
  evidenceHash: hashBytes(Buffer.from("evidence")),
});
```

### Delegation

Grant granular permissions to delegates with spend limits, token restrictions, and expiration. Supports up to 3 levels of sub-delegation.

```ts
import { DelegationBuilder, createDelegation, revokeDelegation } from "@x84-ai/sdk";
import { BN } from "@coral-xyz/anchor";

// Fluent builder (recommended)
const { instruction, delegationPda, delegationId } = await new DelegationBuilder()
  .transact()
  .feedback()
  .metadata()
  .spendLimit(new BN(1_000_000), new BN(100_000_000))
  .tokens([usdcMint])
  .expiry(Math.floor(Date.now() / 1000) + 86400) // 24h
  .uses(100)
  .build(program, delegator, delegate, agentMint);

// Or create directly
const { instruction } = await createDelegation(program, {
  delegator: wallet.publicKey,
  delegate: delegatePubkey,
  nftMint: agentMint,
  permissions: {
    canTransact: true,
    canGiveFeedback: true,
    canUpdateMetadata: false,
    canUpdatePricing: false,
    canRegisterServices: false,
    canManage: false,
    canRedelegate: false,
  },
  constraints: {
    maxSpendPerTx: new BN(1_000_000),
    maxSpendTotal: new BN(10_000_000),
    allowedTokens: [usdcMint],
    allowedPrograms: [],
    expiresAt: new BN(0), // no expiry
    usesRemaining: new BN(0), // unlimited
  },
});

// Revoke (delegator or agent owner)
await revokeDelegation(program, {
  caller: wallet.publicKey,
  nftMint: agentMint,
  delegationPda,
});
```

### Payment & Settlement

Set pricing for services and settle payments with automatic protocol fee split (3% default).

```ts
import {
  setPaymentRequirement,
  updatePaymentRequirement,
  PaymentScheme,
} from "@x84-ai/sdk";
import { buildVerifyAndSettleIx, buildCloseReceiptIx } from "@x84-ai/sdk/settlement";

// Set pricing for a service
const { instruction, paymentReqPda } = await setPaymentRequirement(program, {
  caller: wallet.publicKey,
  nftMint: agentMint,
  serviceType: ServiceType.A2A,
  scheme: PaymentScheme.Exact,
  amount: new BN(100_000), // 0.1 USDC (6 decimals)
  tokenMint: usdcMint,
  payTo: wallet.publicKey,
  description: "Per-request A2A inference",
  resource: "/a2a",
});

// Settle a payment (creates receipt PDA)
const { instruction: settleIx, receiptPda } = buildVerifyAndSettleIx({
  program,
  paymentId: randomPaymentId(),
  txSignature: new Uint8Array(64),
  amount: new BN(100_000),
  resource: "/a2a",
  settlementMode: { atomic: {} },
  accounts: {
    payer: payerPubkey,
    nftMint: agentMint,
    agentIdentity: agentPda,
    paymentRequirement: paymentReqPda,
    payerTokenAccount,
    payeeTokenAccount,
    treasuryTokenAccount,
    tokenMint: usdcMint,
    tokenProgram: TOKEN_PROGRAM_ID,
    config: configPda,
  },
});

// Close receipt (reclaim rent)
const closeIx = buildCloseReceiptIx({ program, payer: payerPubkey, receipt: receiptPda });
```

## Fetching On-Chain Data

```ts
import {
  fetchAgentIdentity,
  fetchAllAgents,
  fetchAgentsByOwner,
  fetchServicesByAgent,
  fetchFeedbacksByAgent,
  fetchDelegationsByDelegate,
  fetchPaymentRequirement,
} from "@x84-ai/sdk";

// Single agent
const agent = await fetchAgentIdentity(program, agentMint);
console.log(agent.name, agent.owner.toBase58(), agent.active);

// All agents
const agents = await fetchAllAgents(program);

// By owner
const myAgents = await fetchAgentsByOwner(program, wallet.publicKey);

// Services for an agent
const services = await fetchServicesByAgent(program, agentMint);

// Feedback entries
const feedback = await fetchFeedbacksByAgent(program, agentMint);

// Delegations granted to a delegate
const delegations = await fetchDelegationsByDelegate(program, delegatePubkey);

// Payment requirement
const payReq = await fetchPaymentRequirement(program, agentMint, ServiceType.A2A);
```

## PDA Derivation

All PDAs are deterministically derived:

```ts
import {
  findAgentPda,
  findServicePda,
  findFeedbackPda,
  findDelegationPda,
  findPaymentReqPda,
  findReceiptPda,
  findValidationRequestPda,
  findValidationResponsePda,
  findVaultPda,
} from "@x84-ai/sdk";

const [agentPda] = findAgentPda(nftMint);               // ["agent", nft_mint]
const [servicePda] = findServicePda(nftMint, "a2a");     // ["service", nft_mint, type]
const [feedbackPda] = findFeedbackPda(nftMint, reviewer, nonce);
const [delegationPda] = findDelegationPda(delegator, delegate, delegationId);
const [paymentPda] = findPaymentReqPda(nftMint, "a2a");
const [receiptPda] = findReceiptPda(paymentId);
const [vaultPda] = findVaultPda(delegationPda);
```

## Event Parsing

Parse protocol events from transaction logs:

```ts
import { parseEventsFromTx, parseEventsFromLogs, findEvent } from "@x84-ai/sdk";

// From a confirmed transaction
const events = await parseEventsFromTx(program, connection, txSignature);
const registered = findEvent(events, "AgentRegistered");
if (registered) {
  console.log("Agent:", registered.nftMint.toBase58());
}

// From raw logs
const events = parseEventsFromLogs(program, logs);
```

**Emitted events:** AgentRegistered, MetadataUpdated, AgentDeactivated, AgentReactivated, AgentClaimed, FeedbackAuthorityUpdated, ServiceAdded, ServiceUpdated, ServiceRemoved, FeedbackGiven, FeedbackRevoked, ValidationRequested, ValidationResponded, DelegationCreated, DelegationRevoked, PaymentRequirementSet, PaymentSettled

## Utilities

```ts
import {
  hashTag,
  hashBytes,
  zeroBytes32,
  zeroBytes64,
  randomPaymentId,
  stringToBytes32,
} from "@x84-ai/sdk";

hashTag("speed");                          // SHA-256 → [u8; 32]
hashBytes(Buffer.from("data"));            // SHA-256 → [u8; 32]
randomPaymentId();                         // Crypto-random 32 bytes
zeroBytes32();                             // [0; 32]
```

## Error Handling

```ts
import { parseX84Error, X84ErrorCode } from "@x84-ai/sdk";

try {
  await sendTransaction(tx);
} catch (err) {
  const parsed = parseX84Error(err);
  if (parsed?.code === X84ErrorCode.AgentInactive) {
    console.log("Agent is deactivated");
  }
}
```

## Exports

| Path | Description |
|------|-------------|
| `@x84-ai/sdk` | Core SDK (identity, service, reputation, validation, delegation, payment) |
| `@x84-ai/sdk/settlement` | Settlement instruction builders (`buildVerifyAndSettleIx`, `buildCloseReceiptIx`) |
| `@x84-ai/sdk/idl` | Anchor IDL (JSON + TypeScript types) |

## Key Concepts

- **Agent ID = NFT mint pubkey** — No counters, no hashes. The Metaplex Core NFT address is the agent's identity.
- **Owner follows NFT** — Transferring the NFT transfers the agent and its revenue stream. Call `claimAgent()` after transfer to update on-chain ownership (invalidates all delegations via `owner_version`).
- **Feedback authority** — A separate keypair from the owner, used for Ed25519 signature verification on feedback submissions.
- **Settlement modes** — Atomic (direct CPI transfer), Attestation (facilitator-witnessed), Delegated (vault-backed or self-service).
- **Protocol fee** — 3% (300 bps) on all settlements, sent to the protocol treasury.

## License

MIT
