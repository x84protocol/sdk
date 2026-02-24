import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { BN } from "../anchor-compat";
import type { X84Program } from "../types";
import type { DelegationPermissions, DelegationConstraints } from "../types";
import { findAgentPda, findConfigPda, findDelegationPda } from "../pda";

// ── DelegationBuilder ───────────────────────────────────────────────

/**
 * Fluent builder for the `create_delegation` instruction.
 *
 * Usage:
 * ```ts
 * const { instruction } = await new DelegationBuilder()
 *   .transact()
 *   .feedback()
 *   .spendLimit(new BN(1_000_000), new BN(10_000_000))
 *   .tokens([usdcMint])
 *   .expiry(Math.floor(Date.now() / 1000) + 86400)
 *   .build(program, delegator, delegate, nftMint);
 * ```
 */
export class DelegationBuilder {
  private permissions: DelegationPermissions = {
    canTransact: false,
    canGiveFeedback: false,
    canUpdateMetadata: false,
    canUpdatePricing: false,
    canRegisterServices: false,
    canManage: false,
    canRedelegate: false,
  };
  private constraints: DelegationConstraints = {
    maxSpendPerTx: new BN(0),
    maxSpendTotal: new BN(0),
    allowedTokens: [],
    allowedPrograms: [],
    expiresAt: new BN(0),
    usesRemaining: new BN(0),
  };
  private parentDelegationPda: PublicKey | null = null;

  transact(): this {
    this.permissions.canTransact = true;
    return this;
  }

  feedback(): this {
    this.permissions.canGiveFeedback = true;
    return this;
  }

  metadata(): this {
    this.permissions.canUpdateMetadata = true;
    return this;
  }

  pricing(): this {
    this.permissions.canUpdatePricing = true;
    return this;
  }

  services(): this {
    this.permissions.canRegisterServices = true;
    return this;
  }

  manage(): this {
    this.permissions.canManage = true;
    return this;
  }

  redelegate(): this {
    this.permissions.canRedelegate = true;
    return this;
  }

  /** Grant all permissions. */
  allPermissions(): this {
    this.permissions.canTransact = true;
    this.permissions.canGiveFeedback = true;
    this.permissions.canUpdateMetadata = true;
    this.permissions.canUpdatePricing = true;
    this.permissions.canRegisterServices = true;
    this.permissions.canManage = true;
    this.permissions.canRedelegate = true;
    return this;
  }

  /** Set per-transaction and total spend limits (0 = unlimited). */
  spendLimit(perTx: BN, total: BN): this {
    this.constraints.maxSpendPerTx = perTx;
    this.constraints.maxSpendTotal = total;
    return this;
  }

  /** Restrict to specific token mints (empty = all allowed, max 5). */
  tokens(mints: PublicKey[]): this {
    this.constraints.allowedTokens = mints;
    return this;
  }

  /** Restrict to specific programs (empty = all allowed, max 5). */
  programs(ids: PublicKey[]): this {
    this.constraints.allowedPrograms = ids;
    return this;
  }

  /** Set expiration as Unix timestamp in seconds (0 = no expiry). */
  expiry(unixSeconds: number): this {
    this.constraints.expiresAt = new BN(unixSeconds);
    return this;
  }

  /** Limit number of uses (0 = unlimited). */
  uses(count: number): this {
    this.constraints.usesRemaining = new BN(count);
    return this;
  }

  /** For sub-delegation: set the parent delegation PDA. */
  parent(parentDelegation: PublicKey): this {
    this.parentDelegationPda = parentDelegation;
    return this;
  }

  /**
   * Build the `create_delegation` instruction.
   * Fetches the agent's delegation_count to derive the correct PDA.
   *
   * Signer required: delegator.
   */
  async build(
    program: X84Program,
    delegator: PublicKey,
    delegate: PublicKey,
    nftMint: PublicKey
  ): Promise<{
    instruction: TransactionInstruction;
    delegationPda: PublicKey;
    delegationId: BN;
  }> {
    const [configPda] = findConfigPda(program.programId);
    const [agentPda] = findAgentPda(nftMint, program.programId);

    // Fetch current delegation_count to derive the next delegation PDA
    const agent = await program.account.agentIdentity.fetch(agentPda);
    const delegationId = agent.delegationCount as BN;
    const [delegationPda] = findDelegationPda(
      delegator,
      delegate,
      delegationId,
      program.programId
    );

    const p = this.permissions;
    const c = this.constraints;

    const ix = await program.methods
      .createDelegation(
        p.canTransact,
        p.canGiveFeedback,
        p.canUpdateMetadata,
        p.canUpdatePricing,
        p.canRegisterServices,
        p.canManage,
        p.canRedelegate,
        c.maxSpendPerTx,
        c.maxSpendTotal,
        c.allowedTokens,
        c.allowedPrograms,
        c.expiresAt,
        c.usesRemaining
      )
      .accountsPartial({
        delegator,
        delegate,
        nftMint,
        agentIdentity: agentPda,
        delegation: delegationPda,
        parentDelegation: this.parentDelegationPda,
        config: configPda,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    return { instruction: ix, delegationPda, delegationId };
  }
}

// ── create_delegation (direct) ──────────────────────────────────────

export interface CreateDelegationArgs {
  delegator: PublicKey;
  delegate: PublicKey;
  nftMint: PublicKey;
  permissions: DelegationPermissions;
  constraints: DelegationConstraints;
  parentDelegation?: PublicKey | null;
}

/**
 * Build the `create_delegation` instruction directly (without builder).
 *
 * Signer required: delegator.
 */
export async function createDelegation(
  program: X84Program,
  args: CreateDelegationArgs
): Promise<{
  instruction: TransactionInstruction;
  delegationPda: PublicKey;
  delegationId: BN;
}> {
  const builder = new DelegationBuilder();

  if (args.permissions.canTransact) builder.transact();
  if (args.permissions.canGiveFeedback) builder.feedback();
  if (args.permissions.canUpdateMetadata) builder.metadata();
  if (args.permissions.canUpdatePricing) builder.pricing();
  if (args.permissions.canRegisterServices) builder.services();
  if (args.permissions.canManage) builder.manage();
  if (args.permissions.canRedelegate) builder.redelegate();

  builder
    .spendLimit(args.constraints.maxSpendPerTx, args.constraints.maxSpendTotal)
    .tokens(args.constraints.allowedTokens)
    .programs(args.constraints.allowedPrograms)
    .expiry(args.constraints.expiresAt.toNumber())
    .uses(args.constraints.usesRemaining.toNumber());

  if (args.parentDelegation) builder.parent(args.parentDelegation);

  return builder.build(program, args.delegator, args.delegate, args.nftMint);
}

// ── revoke_delegation ───────────────────────────────────────────────

export interface RevokeDelegationArgs {
  caller: PublicKey;
  nftMint: PublicKey;
  delegationPda: PublicKey;
}

/**
 * Build the `revoke_delegation` instruction.
 *
 * Signer required: caller (delegator or agent owner).
 */
export async function revokeDelegation(
  program: X84Program,
  args: RevokeDelegationArgs
): Promise<{ instruction: TransactionInstruction }> {
  const [agentPda] = findAgentPda(args.nftMint, program.programId);

  const ix = await program.methods
    .revokeDelegation()
    .accountsPartial({
      caller: args.caller,
      nftMint: args.nftMint,
      agentIdentity: agentPda,
      delegation: args.delegationPda,
    })
    .instruction();

  return { instruction: ix };
}
