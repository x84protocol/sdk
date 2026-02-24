import {
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  TransactionInstruction,
  Ed25519Program,
} from "@solana/web3.js";
import { BN } from "../anchor-compat";
import type { X84Program } from "../types";
import { findAgentPda, findConfigPda, findFeedbackPda } from "../pda";

// ── give_feedback ───────────────────────────────────────────────────

export interface GiveFeedbackArgs {
  reviewer: PublicKey;
  nftMint: PublicKey;
  score: number;
  tag1: number[];
  tag2: number[];
  detailUri: string;
  detailHash: number[];
  feedbackAuth: number[];
  feedbackNonce: BN;
  /** Optional PaymentReceipt PDA — proves the reviewer paid for the agent's service. */
  paymentReceipt?: PublicKey;
}

export interface GiveFeedbackResult {
  /** Ed25519 verify instruction — must be placed immediately before the feedback instruction. */
  ed25519Instruction: TransactionInstruction | null;
  instruction: TransactionInstruction;
  feedbackPda: PublicKey;
}

/**
 * Build the `give_feedback` instruction.
 * Requires a preceding Ed25519 signature verification instruction.
 *
 * If `feedbackAuthoritySecret` is provided, the Ed25519 instruction is auto-built.
 * Otherwise, set `ed25519Instruction` to null and build it yourself.
 *
 * Signer required: reviewer.
 */
export async function giveFeedback(
  program: X84Program,
  args: GiveFeedbackArgs,
  feedbackAuthoritySecret?: Uint8Array
): Promise<GiveFeedbackResult> {
  const [configPda] = findConfigPda(program.programId);
  const [agentPda] = findAgentPda(args.nftMint, program.programId);
  const [feedbackPda] = findFeedbackPda(
    args.nftMint,
    args.reviewer,
    args.feedbackNonce,
    program.programId
  );

  let ed25519Ix: TransactionInstruction | null = null;

  if (feedbackAuthoritySecret) {
    // Build Ed25519 verification instruction
    // Message: reviewer_pubkey(32) || nft_mint(32)
    const message = Buffer.concat([
      args.reviewer.toBuffer(),
      args.nftMint.toBuffer(),
    ]);
    ed25519Ix = Ed25519Program.createInstructionWithPrivateKey({
      privateKey: feedbackAuthoritySecret,
      message,
    });
  }

  const ix = await program.methods
    .giveFeedback(
      args.score,
      args.tag1,
      args.tag2,
      args.detailUri,
      args.detailHash,
      args.feedbackAuth,
      args.feedbackNonce
    )
    .accountsPartial({
      reviewer: args.reviewer,
      config: configPda,
      agent: agentPda,
      nftMint: args.nftMint,
      feedbackEntry: feedbackPda,
      paymentReceipt: args.paymentReceipt ?? null,
      instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  return { ed25519Instruction: ed25519Ix, instruction: ix, feedbackPda };
}

// ── revoke_feedback ─────────────────────────────────────────────────

export interface RevokeFeedbackArgs {
  reviewer: PublicKey;
  nftMint: PublicKey;
  feedbackNonce: BN;
}

/**
 * Build the `revoke_feedback` instruction.
 *
 * Signer required: reviewer (original feedback author).
 */
export async function revokeFeedback(
  program: X84Program,
  args: RevokeFeedbackArgs
): Promise<{ instruction: TransactionInstruction; feedbackPda: PublicKey }> {
  const [agentPda] = findAgentPda(args.nftMint, program.programId);
  const [feedbackPda] = findFeedbackPda(
    args.nftMint,
    args.reviewer,
    args.feedbackNonce,
    program.programId
  );

  const ix = await program.methods
    .revokeFeedback()
    .accountsPartial({
      reviewer: args.reviewer,
      agent: agentPda,
      feedbackEntry: feedbackPda,
    })
    .instruction();

  return { instruction: ix, feedbackPda };
}
