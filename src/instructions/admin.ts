import {
  Keypair,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import { BN } from "../anchor-compat";
import type { X84Program } from "../types";
import { findConfigPda } from "../pda";

// ── initialize ──────────────────────────────────────────────────────

export interface InitializeArgs {
  authority: PublicKey;
  registrationFee: BN;
  settlementFeeBps: number;
  feeTreasury: PublicKey;
  collection?: Keypair;
}

export interface InitializeResult {
  instruction: TransactionInstruction;
  collection: Keypair;
  configPda: PublicKey;
}

/**
 * Build the `initialize` instruction.
 * Creates the ProtocolConfig PDA and a Metaplex Core Collection.
 *
 * Signers required: authority, collection keypair.
 */
export async function initialize(
  program: X84Program,
  args: InitializeArgs
): Promise<InitializeResult> {
  const collection = args.collection ?? Keypair.generate();
  const [configPda] = findConfigPda(program.programId);

  const ix = await program.methods
    .initialize(
      args.registrationFee,
      args.settlementFeeBps,
      args.feeTreasury
    )
    .accountsPartial({
      authority: args.authority,
      collection: collection.publicKey,
    })
    .instruction();

  return { instruction: ix, collection, configPda };
}

// ── update_config ───────────────────────────────────────────────────

export interface UpdateConfigArgs {
  authority: PublicKey;
  newFee?: BN | null;
  newSettlementFeeBps?: number | null;
  newTreasury?: PublicKey | null;
  newAuthority?: PublicKey | null;
  newFacilitator?: PublicKey | null;
  pauseIdentity?: boolean | null;
  pauseReputation?: boolean | null;
  pauseValidation?: boolean | null;
  pauseDelegation?: boolean | null;
  pausePayments?: boolean | null;
}

/**
 * Build the `update_config` instruction.
 * All fields are optional — only non-null values are updated.
 *
 * Signer required: authority.
 */
export async function updateConfig(
  program: X84Program,
  args: UpdateConfigArgs
): Promise<{ instruction: TransactionInstruction; configPda: PublicKey }> {
  const [configPda] = findConfigPda(program.programId);

  const ix = await program.methods
    .updateConfig(
      args.newFee ?? null,
      args.newSettlementFeeBps ?? null,
      args.newTreasury ?? null,
      args.newAuthority ?? null,
      args.newFacilitator ?? null,
      args.pauseIdentity ?? null,
      args.pauseReputation ?? null,
      args.pauseValidation ?? null,
      args.pauseDelegation ?? null,
      args.pausePayments ?? null
    )
    .accountsPartial({
      authority: args.authority,
    })
    .instruction();

  return { instruction: ix, configPda };
}
