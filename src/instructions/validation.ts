import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import type { X84Program } from "../types";
import {
  findAgentPda,
  findConfigPda,
  findValidationRequestPda,
  findValidationResponsePda,
} from "../pda";

// ── validation_request ──────────────────────────────────────────────

export interface ValidationRequestArgs {
  caller: PublicKey;
  nftMint: PublicKey;
  validator: PublicKey;
  requestHash: number[];
  tag: number[];
  requestUri: string;
  delegation?: PublicKey | null;
}

/**
 * Build the `validation_request` instruction.
 *
 * Signer required: caller (owner or delegate).
 */
export async function validationRequest(
  program: X84Program,
  args: ValidationRequestArgs
): Promise<{
  instruction: TransactionInstruction;
  validationRequestPda: PublicKey;
}> {
  const [configPda] = findConfigPda(program.programId);
  const [agentPda] = findAgentPda(args.nftMint, program.programId);
  const hashBuf = Uint8Array.from(args.requestHash);
  const [valReqPda] = findValidationRequestPda(
    args.nftMint,
    args.validator,
    hashBuf,
    program.programId
  );

  const ix = await program.methods
    .validationRequest(args.validator, args.requestHash, args.tag, args.requestUri)
    .accountsPartial({
      caller: args.caller,
      config: configPda,
      agent: agentPda,
      nftMint: args.nftMint,
      validationRequest: valReqPda,
      delegation: args.delegation ?? null,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  return { instruction: ix, validationRequestPda: valReqPda };
}

// ── validation_response ─────────────────────────────────────────────

export interface ValidationResponseArgs {
  validator: PublicKey;
  nftMint: PublicKey;
  requestHash: number[];
  score: number;
  tag: number[];
  evidenceUri: string;
  evidenceHash: number[];
}

/**
 * Build the `validation_response` instruction.
 *
 * Signer required: validator.
 */
export async function validationResponse(
  program: X84Program,
  args: ValidationResponseArgs
): Promise<{
  instruction: TransactionInstruction;
  validationResponsePda: PublicKey;
}> {
  const [agentPda] = findAgentPda(args.nftMint, program.programId);
  const hashBuf = Uint8Array.from(args.requestHash);
  const [valReqPda] = findValidationRequestPda(
    args.nftMint,
    args.validator,
    hashBuf,
    program.programId
  );
  const [valRespPda] = findValidationResponsePda(
    args.nftMint,
    args.validator,
    hashBuf,
    program.programId
  );

  const ix = await program.methods
    .validationResponse(args.score, args.tag, args.evidenceUri, args.evidenceHash)
    .accountsPartial({
      validator: args.validator,
      agent: agentPda,
      validationRequest: valReqPda,
      validationResponse: valRespPda,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  return { instruction: ix, validationResponsePda: valRespPda };
}
