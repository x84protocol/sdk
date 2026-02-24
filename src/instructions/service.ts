import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import type { X84Program } from "../types";
import {
  ServiceType,
  toAnchorServiceType,
  serviceTypeToSeed,
} from "../types";
import { findAgentPda, findConfigPda, findServicePda } from "../pda";

// ── add_service ─────────────────────────────────────────────────────

export interface AddServiceArgs {
  caller: PublicKey;
  nftMint: PublicKey;
  serviceType: ServiceType;
  endpoint: string;
  version: string;
  delegation?: PublicKey | null;
}

/**
 * Build the `add_service` instruction.
 *
 * Signer required: caller (owner or delegate).
 */
export async function addService(
  program: X84Program,
  args: AddServiceArgs
): Promise<{ instruction: TransactionInstruction; servicePda: PublicKey }> {
  const seed = serviceTypeToSeed(args.serviceType);
  const [configPda] = findConfigPda(program.programId);
  const [agentPda] = findAgentPda(args.nftMint, program.programId);
  const [servicePda] = findServicePda(args.nftMint, seed, program.programId);

  const ix = await program.methods
    .addService(toAnchorServiceType(args.serviceType), args.endpoint, args.version)
    .accountsPartial({
      caller: args.caller,
      config: configPda,
      agent: agentPda,
      nftMint: args.nftMint,
      service: servicePda,
      delegation: args.delegation ?? null,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  return { instruction: ix, servicePda };
}

// ── update_service ──────────────────────────────────────────────────

export interface UpdateServiceArgs {
  caller: PublicKey;
  nftMint: PublicKey;
  serviceType: ServiceType;
  newEndpoint?: string | null;
  newVersion?: string | null;
  delegation?: PublicKey | null;
}

/**
 * Build the `update_service` instruction.
 *
 * Signer required: caller (owner or delegate).
 */
export async function updateService(
  program: X84Program,
  args: UpdateServiceArgs
): Promise<{ instruction: TransactionInstruction; servicePda: PublicKey }> {
  const seed = serviceTypeToSeed(args.serviceType);
  const [agentPda] = findAgentPda(args.nftMint, program.programId);
  const [servicePda] = findServicePda(args.nftMint, seed, program.programId);

  const ix = await program.methods
    .updateService(args.newEndpoint ?? null, args.newVersion ?? null)
    .accountsPartial({
      caller: args.caller,
      agent: agentPda,
      nftMint: args.nftMint,
      service: servicePda,
      delegation: args.delegation ?? null,
    })
    .instruction();

  return { instruction: ix, servicePda };
}

// ── remove_service ──────────────────────────────────────────────────

export interface RemoveServiceArgs {
  caller: PublicKey;
  nftMint: PublicKey;
  serviceType: ServiceType;
  delegation?: PublicKey | null;
}

/**
 * Build the `remove_service` instruction.
 * Closes the service PDA and refunds rent to the caller.
 *
 * Signer required: caller (owner or delegate).
 */
export async function removeService(
  program: X84Program,
  args: RemoveServiceArgs
): Promise<{ instruction: TransactionInstruction; servicePda: PublicKey }> {
  const seed = serviceTypeToSeed(args.serviceType);
  const [agentPda] = findAgentPda(args.nftMint, program.programId);
  const [servicePda] = findServicePda(args.nftMint, seed, program.programId);

  const ix = await program.methods
    .removeService()
    .accountsPartial({
      caller: args.caller,
      agent: agentPda,
      nftMint: args.nftMint,
      service: servicePda,
      delegation: args.delegation ?? null,
    })
    .instruction();

  return { instruction: ix, servicePda };
}
