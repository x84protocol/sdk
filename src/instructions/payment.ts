import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { BN } from "../anchor-compat";
import type { X84Program } from "../types";
import {
  ServiceType,
  PaymentScheme,
  toAnchorServiceType,
  toAnchorPaymentScheme,
  serviceTypeToSeed,
} from "../types";
import { findAgentPda, findConfigPda, findPaymentReqPda } from "../pda";

// ── set_payment_requirement ─────────────────────────────────────────

export interface SetPaymentRequirementArgs {
  caller: PublicKey;
  nftMint: PublicKey;
  serviceType: ServiceType;
  scheme: PaymentScheme;
  amount: BN;
  tokenMint: PublicKey;
  payTo: PublicKey;
  description: string;
  resource: string;
  delegation?: PublicKey | null;
}

/**
 * Build the `set_payment_requirement` instruction.
 *
 * Signer required: caller (owner or delegate).
 */
export async function setPaymentRequirement(
  program: X84Program,
  args: SetPaymentRequirementArgs
): Promise<{
  instruction: TransactionInstruction;
  paymentReqPda: PublicKey;
}> {
  const seed = serviceTypeToSeed(args.serviceType);
  const [configPda] = findConfigPda(program.programId);
  const [agentPda] = findAgentPda(args.nftMint, program.programId);
  const [paymentReqPda] = findPaymentReqPda(
    args.nftMint,
    seed,
    program.programId
  );

  const ix = await program.methods
    .setPaymentRequirement(
      toAnchorServiceType(args.serviceType),
      toAnchorPaymentScheme(args.scheme),
      args.amount,
      args.tokenMint,
      args.payTo,
      args.description,
      args.resource
    )
    .accountsPartial({
      caller: args.caller,
      nftMint: args.nftMint,
      agentIdentity: agentPda,
      paymentRequirement: paymentReqPda,
      delegation: args.delegation ?? null,
      config: configPda,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  return { instruction: ix, paymentReqPda };
}

// ── update_payment_requirement ──────────────────────────────────────

export interface UpdatePaymentRequirementArgs {
  caller: PublicKey;
  nftMint: PublicKey;
  serviceType: ServiceType;
  newAmount?: BN | null;
  newPayTo?: PublicKey | null;
  newDescription?: string | null;
  newActive?: boolean | null;
  delegation?: PublicKey | null;
}

/**
 * Build the `update_payment_requirement` instruction.
 *
 * Signer required: caller (owner or delegate).
 */
export async function updatePaymentRequirement(
  program: X84Program,
  args: UpdatePaymentRequirementArgs
): Promise<{
  instruction: TransactionInstruction;
  paymentReqPda: PublicKey;
}> {
  const seed = serviceTypeToSeed(args.serviceType);
  const [agentPda] = findAgentPda(args.nftMint, program.programId);
  const [paymentReqPda] = findPaymentReqPda(
    args.nftMint,
    seed,
    program.programId
  );

  const ix = await program.methods
    .updatePaymentRequirement(
      args.newAmount ?? null,
      args.newPayTo ?? null,
      args.newDescription ?? null,
      args.newActive ?? null
    )
    .accountsPartial({
      caller: args.caller,
      nftMint: args.nftMint,
      agentIdentity: agentPda,
      paymentRequirement: paymentReqPda,
      delegation: args.delegation ?? null,
    })
    .instruction();

  return { instruction: ix, paymentReqPda };
}
