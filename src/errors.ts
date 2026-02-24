/**
 * x84 program error codes.
 * Anchor error codes start at 6000 + index.
 */
export enum X84ErrorCode {
  MetadataUriTooLong = 6000,
  VersionTooLong = 6001,
  DescriptionTooLong = 6002,
  ResourceTooLong = 6003,
  EndpointTooLong = 6004,
  InvalidFeedbackScore = 6005,
  InvalidValidationScore = 6006,
  TooManyTags = 6007,
  TooManyAllowedTokens = 6008,
  TooManyAllowedPrograms = 6009,
  AgentInactive = 6010,
  AgentAlreadyActive = 6011,
  Unauthorized = 6012,
  InvalidFeedbackAuth = 6013,
  FeedbackAlreadyRevoked = 6014,
  DelegationInactive = 6015,
  DelegationExpired = 6016,
  DelegationExhausted = 6017,
  InsufficientPermission = 6018,
  ExceedsPerTxLimit = 6019,
  ExceedsTotalLimit = 6020,
  TokenNotAllowed = 6021,
  ProgramNotAllowed = 6022,
  SubDelegationExceedsParent = 6023,
  CannotRedelegate = 6024,
  MaxDelegationDepthExceeded = 6025,
  DelegationOwnerVersionMismatch = 6026,
  PaymentRequirementInactive = 6027,
  InsufficientPayment = 6028,
  PaymentReplay = 6029,
  ServiceAlreadyExists = 6030,
  NotNftHolder = 6031,
  ValidationAlreadyResponded = 6032,
  ValidatorMismatch = 6033,
  ModulePaused = 6034,
  SettlementFeeTooHigh = 6035,
  InsufficientRegistrationFee = 6036,
  DelegationRequiredForDelegatedMode = 6037,
  FacilitatorRequired = 6038,
  FacilitatorNotApproved = 6039,
  InsufficientDelegateAllowance = 6040,
  Ed25519InstructionNotFound = 6041,
  InvalidEd25519InstructionData = 6042,
  TokenMintMismatch = 6043,
  PaymentAmountMismatch = 6044,
  MathOverflow = 6045,
  AttestationUnauthorized = 6046,
  PayToRedirectNotAllowed = 6047,
  ReceiptNotSettled = 6048,
  ReceiptAgentMismatch = 6049,
  ReceiptPayerMismatch = 6050,
}

const ERROR_MESSAGES: Record<number, string> = {
  [X84ErrorCode.MetadataUriTooLong]:
    "Metadata URI exceeds maximum length of 200 characters",
  [X84ErrorCode.VersionTooLong]:
    "Version string exceeds maximum length of 20 characters",
  [X84ErrorCode.DescriptionTooLong]:
    "Description exceeds maximum length of 200 characters",
  [X84ErrorCode.ResourceTooLong]:
    "Resource path exceeds maximum length of 200 characters",
  [X84ErrorCode.EndpointTooLong]:
    "Endpoint URL exceeds maximum length of 200 characters",
  [X84ErrorCode.InvalidFeedbackScore]:
    "Feedback score must be between 0 and 100",
  [X84ErrorCode.InvalidValidationScore]:
    "Validation score must be between 0 and 100",
  [X84ErrorCode.TooManyTags]: "Too many tags (maximum 5)",
  [X84ErrorCode.TooManyAllowedTokens]:
    "Too many allowed tokens (maximum 5)",
  [X84ErrorCode.TooManyAllowedPrograms]:
    "Too many allowed programs (maximum 5)",
  [X84ErrorCode.AgentInactive]: "Agent is not active",
  [X84ErrorCode.AgentAlreadyActive]: "Agent is already active",
  [X84ErrorCode.Unauthorized]:
    "Unauthorized: caller is not the owner and has no valid delegation",
  [X84ErrorCode.InvalidFeedbackAuth]:
    "Invalid feedback authorization signature",
  [X84ErrorCode.FeedbackAlreadyRevoked]: "Feedback already revoked",
  [X84ErrorCode.DelegationInactive]: "Delegation is not active",
  [X84ErrorCode.DelegationExpired]: "Delegation has expired",
  [X84ErrorCode.DelegationExhausted]: "Delegation has no remaining uses",
  [X84ErrorCode.InsufficientPermission]:
    "Delegation does not have the required permission",
  [X84ErrorCode.ExceedsPerTxLimit]:
    "Transaction amount exceeds delegation per-transaction limit",
  [X84ErrorCode.ExceedsTotalLimit]:
    "Cumulative spend would exceed delegation total limit",
  [X84ErrorCode.TokenNotAllowed]:
    "Token not allowed by delegation constraints",
  [X84ErrorCode.ProgramNotAllowed]:
    "Program not allowed by delegation constraints",
  [X84ErrorCode.SubDelegationExceedsParent]:
    "Sub-delegation constraints must be within parent constraints",
  [X84ErrorCode.CannotRedelegate]:
    "Delegator cannot redelegate (can_redelegate is false)",
  [X84ErrorCode.MaxDelegationDepthExceeded]:
    "Maximum delegation depth exceeded (max 3 levels)",
  [X84ErrorCode.DelegationOwnerVersionMismatch]:
    "Delegation owner_version does not match agent (NFT was transferred)",
  [X84ErrorCode.PaymentRequirementInactive]:
    "Payment requirement is not active",
  [X84ErrorCode.InsufficientPayment]: "Payment amount is insufficient",
  [X84ErrorCode.PaymentReplay]: "Payment ID already used (replay detected)",
  [X84ErrorCode.ServiceAlreadyExists]:
    "Service type already registered for this agent",
  [X84ErrorCode.NotNftHolder]: "Caller does not hold the agent NFT",
  [X84ErrorCode.ValidationAlreadyResponded]:
    "Validation request already responded",
  [X84ErrorCode.ValidatorMismatch]:
    "Validator does not match the validation request",
  [X84ErrorCode.ModulePaused]: "Protocol module is paused",
  [X84ErrorCode.SettlementFeeTooHigh]:
    "Settlement fee basis points exceeds maximum (1000 = 10%)",
  [X84ErrorCode.InsufficientRegistrationFee]:
    "Insufficient SOL for registration fee",
  [X84ErrorCode.DelegationRequiredForDelegatedMode]:
    "Delegated settlement requires a delegation account",
  [X84ErrorCode.FacilitatorRequired]:
    "Delegated settlement requires facilitator as signer",
  [X84ErrorCode.FacilitatorNotApproved]:
    "Facilitator is not an approved SPL Token delegate",
  [X84ErrorCode.InsufficientDelegateAllowance]:
    "SPL Token delegate allowance insufficient",
  [X84ErrorCode.Ed25519InstructionNotFound]:
    "Ed25519 program instruction not found in transaction",
  [X84ErrorCode.InvalidEd25519InstructionData]:
    "Invalid Ed25519 instruction data",
  [X84ErrorCode.TokenMintMismatch]:
    "Token mint does not match payment requirement or token accounts",
  [X84ErrorCode.PaymentAmountMismatch]:
    "Payment amount does not match exact requirement",
  [X84ErrorCode.MathOverflow]: "Arithmetic overflow",
  [X84ErrorCode.AttestationUnauthorized]:
    "Attestation mode requires protocol authority or facilitator",
  [X84ErrorCode.PayToRedirectNotAllowed]:
    "Delegates cannot redirect payment destination away from agent owner",
  [X84ErrorCode.ReceiptNotSettled]: "Payment receipt has not been settled",
  [X84ErrorCode.ReceiptAgentMismatch]:
    "Payment receipt agent does not match feedback target",
  [X84ErrorCode.ReceiptPayerMismatch]:
    "Payment receipt payer does not match reviewer",
};

export class X84Error extends Error {
  constructor(
    public readonly code: X84ErrorCode,
    message?: string
  ) {
    super(message ?? ERROR_MESSAGES[code] ?? `Unknown error: ${code}`);
    this.name = "X84Error";
  }
}

/**
 * Parse an Anchor error into a typed X84Error.
 * Returns null if the error is not an x84 program error.
 */
export function parseX84Error(err: unknown): X84Error | null {
  if (err == null || typeof err !== "object") return null;

  const errObj = err as Record<string, unknown>;

  // Anchor AnchorError format
  if (
    "error" in errObj &&
    typeof errObj.error === "object" &&
    errObj.error != null
  ) {
    const inner = errObj.error as Record<string, unknown>;
    if (typeof inner.errorCode === "object" && inner.errorCode != null) {
      const codeObj = inner.errorCode as Record<string, unknown>;
      if (typeof codeObj.number === "number") {
        const code = codeObj.number as X84ErrorCode;
        if (code >= 6000 && code <= 6050) {
          return new X84Error(code, codeObj.code as string);
        }
      }
    }
  }

  // Fallback: check error message for hex error code
  const msg = String(err);
  const hexMatch = msg.match(/0x([0-9a-fA-F]+)/);
  if (hexMatch) {
    const code = parseInt(hexMatch[1], 16);
    if (code >= 6000 && code <= 6050) {
      return new X84Error(code as X84ErrorCode);
    }
  }

  return null;
}
