import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import type { X84Program } from "../types";
import { findAgentPda, findConfigPda } from "../pda";
import { MPL_CORE_PROGRAM_ID } from "../constants";
import { hashTag as hashTagUtil } from "../utils";

// ── register_agent ──────────────────────────────────────────────────

export interface RegisterAgentArgs {
  name: string;
  owner: PublicKey;
  configAuthority: PublicKey;
  metadataUri: string;
  metadataHash: number[];
  feedbackAuthority: PublicKey;
  tags?: number[][] | string[];
  asset?: Keypair;
  collection: PublicKey;
  feeTreasury: PublicKey;
}

export interface RegisterAgentResult {
  instruction: TransactionInstruction;
  asset: Keypair;
  agentPda: PublicKey;
}

/**
 * Build the `register_agent` instruction.
 * Creates an AgentIdentity PDA and mints a Metaplex Core NFT.
 *
 * Tags can be passed as raw `number[][]` or as strings (auto-hashed via SHA-256).
 *
 * Signers required: owner, asset keypair, configAuthority.
 */
export async function registerAgent(
  program: X84Program,
  args: RegisterAgentArgs
): Promise<RegisterAgentResult> {
  const asset = args.asset ?? Keypair.generate();
  const [configPda] = findConfigPda(program.programId);
  const [agentPda] = findAgentPda(asset.publicKey, program.programId);

  const tags: number[][] =
    args.tags?.map((t) =>
      typeof t === "string" ? hashTagUtil(t) : t
    ) ?? [];

  const ix = await program.methods
    .registerAgent(args.name, args.metadataUri, args.metadataHash, args.feedbackAuthority, tags)
    .accountsPartial({
      config: configPda,
      configAuthority: args.configAuthority,
      agentIdentity: agentPda,
      owner: args.owner,
      asset: asset.publicKey,
      collection: args.collection,
      feeTreasury: args.feeTreasury,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  return { instruction: ix, asset, agentPda };
}

// ── update_agent_metadata ───────────────────────────────────────────

export interface UpdateAgentMetadataArgs {
  caller: PublicKey;
  nftMint: PublicKey;
  newUri: string;
  newHash: number[];
  delegation?: PublicKey | null;
}

/**
 * Build the `update_agent_metadata` instruction.
 *
 * Signer required: caller (owner or delegate).
 */
export async function updateAgentMetadata(
  program: X84Program,
  args: UpdateAgentMetadataArgs
): Promise<{ instruction: TransactionInstruction; agentPda: PublicKey }> {
  const [agentPda] = findAgentPda(args.nftMint, program.programId);

  const ix = await program.methods
    .updateAgentMetadata(args.newUri, args.newHash)
    .accountsPartial({
      agentIdentity: agentPda,
      caller: args.caller,
      delegation: args.delegation ?? null,
    })
    .instruction();

  return { instruction: ix, agentPda };
}

// ── deactivate_agent ────────────────────────────────────────────────

/**
 * Build the `deactivate_agent` instruction.
 *
 * Signer required: owner.
 */
export async function deactivateAgent(
  program: X84Program,
  owner: PublicKey,
  nftMint: PublicKey
): Promise<{ instruction: TransactionInstruction; agentPda: PublicKey }> {
  const [agentPda] = findAgentPda(nftMint, program.programId);

  const ix = await program.methods
    .deactivateAgent()
    .accountsPartial({
      agentIdentity: agentPda,
      owner,
    })
    .instruction();

  return { instruction: ix, agentPda };
}

// ── reactivate_agent ────────────────────────────────────────────────

/**
 * Build the `reactivate_agent` instruction.
 *
 * Signer required: owner.
 */
export async function reactivateAgent(
  program: X84Program,
  owner: PublicKey,
  nftMint: PublicKey
): Promise<{ instruction: TransactionInstruction; agentPda: PublicKey }> {
  const [agentPda] = findAgentPda(nftMint, program.programId);

  const ix = await program.methods
    .reactivateAgent()
    .accountsPartial({
      agentIdentity: agentPda,
      owner,
    })
    .instruction();

  return { instruction: ix, agentPda };
}

// ── claim_agent ─────────────────────────────────────────────────────

/**
 * Build the `claim_agent` instruction.
 * Called by the new NFT holder after an NFT transfer. Increments owner_version.
 *
 * Signer required: newOwner (must hold the NFT).
 */
export async function claimAgent(
  program: X84Program,
  newOwner: PublicKey,
  nftMint: PublicKey
): Promise<{ instruction: TransactionInstruction; agentPda: PublicKey }> {
  const [agentPda] = findAgentPda(nftMint, program.programId);

  const ix = await program.methods
    .claimAgent()
    .accountsPartial({
      agentIdentity: agentPda,
      newOwner,
      asset: nftMint,
    })
    .instruction();

  return { instruction: ix, agentPda };
}

// ── set_feedback_authority ──────────────────────────────────────────

/**
 * Build the `set_feedback_authority` instruction.
 *
 * Signer required: owner.
 */
export async function setFeedbackAuthority(
  program: X84Program,
  owner: PublicKey,
  nftMint: PublicKey,
  newAuthority: PublicKey
): Promise<{ instruction: TransactionInstruction; agentPda: PublicKey }> {
  const [agentPda] = findAgentPda(nftMint, program.programId);

  const ix = await program.methods
    .setFeedbackAuthority(newAuthority)
    .accountsPartial({
      agentIdentity: agentPda,
      owner,
    })
    .instruction();

  return { instruction: ix, agentPda };
}
