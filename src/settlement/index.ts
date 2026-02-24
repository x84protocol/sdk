// @x84-ai/sdk/settlement — Settlement module (PDA receipts)

import { PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { BN } from "../anchor-compat";
import type { X84Program, AnchorSettlementMode } from "../types";
import { findReceiptPda } from "../pda";

// ── verify_and_settle Instruction Builder ────────────────────────────

export interface VerifyAndSettleParams {
  program: X84Program;
  paymentId: number[];
  txSignature: number[];
  amount: BN;
  resource: string;
  settlementMode: AnchorSettlementMode;
  accounts: {
    payer: PublicKey;
    nftMint: PublicKey;
    agentIdentity: PublicKey;
    paymentRequirement: PublicKey;
    payerTokenAccount: PublicKey;
    payeeTokenAccount: PublicKey;
    treasuryTokenAccount: PublicKey;
    tokenMint: PublicKey;
    tokenProgram: PublicKey;
    config: PublicKey;
    facilitator?: PublicKey | null;
    delegation?: PublicKey | null;
  };
}

export interface VerifyAndSettleResult {
  instruction: TransactionInstruction;
  receiptPda: PublicKey;
}

/**
 * Build the `verify_and_settle` instruction.
 * Creates a PDA PaymentReceipt on-chain (no Light Protocol / compressed accounts).
 */
export async function buildVerifyAndSettleIx(
  params: VerifyAndSettleParams
): Promise<VerifyAndSettleResult> {
  const [receiptPda] = findReceiptPda(
    new Uint8Array(params.paymentId),
    params.program.programId
  );

  const ix = await params.program.methods
    .verifyAndSettle(
      params.paymentId,
      params.txSignature,
      params.amount,
      params.resource,
      params.settlementMode
    )
    .accountsPartial({
      ...params.accounts,
      paymentReceipt: receiptPda,
      facilitator: params.accounts.facilitator ?? null,
      delegation: params.accounts.delegation ?? null,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  return { instruction: ix, receiptPda };
}

// ── close_receipt Instruction Builder ────────────────────────────────

export interface CloseReceiptParams {
  program: X84Program;
  payer: PublicKey;
  receipt: PublicKey;
}

/**
 * Build the `close_receipt` instruction.
 * Closes a PaymentReceipt PDA and returns rent to the payer.
 */
export async function buildCloseReceiptIx(
  params: CloseReceiptParams
): Promise<TransactionInstruction> {
  return params.program.methods
    .closeReceipt()
    .accountsPartial({
      payer: params.payer,
      receipt: params.receipt,
    })
    .instruction();
}

