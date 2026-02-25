/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/x84.json`.
 */
export type X84 = {
  "address": "X84XXXZsWXpanM5UzshMKZH4wUbeFNcxPWnFyTBgRP5",
  "metadata": {
    "name": "x84",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "x84 Protocol — Agent identity, reputation, delegation, and x402 payment settlement on Solana"
  },
  "instructions": [
    {
      "name": "addService",
      "discriminator": [
        133,
        207,
        106,
        32,
        91,
        111,
        153,
        30
      ],
      "accounts": [
        {
          "name": "caller",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "agent",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ]
          }
        },
        {
          "name": "nftMint"
        },
        {
          "name": "service",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  101,
                  114,
                  118,
                  105,
                  99,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              },
              {
                "kind": "arg",
                "path": "serviceType"
              }
            ]
          }
        },
        {
          "name": "delegation",
          "docs": [
            "Optional delegation for delegate callers"
          ],
          "optional": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "serviceType",
          "type": {
            "defined": {
              "name": "serviceType"
            }
          }
        },
        {
          "name": "endpoint",
          "type": "string"
        },
        {
          "name": "version",
          "type": "string"
        }
      ]
    },
    {
      "name": "claimAgent",
      "discriminator": [
        51,
        236,
        177,
        208,
        161,
        214,
        242,
        56
      ],
      "accounts": [
        {
          "name": "agentIdentity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "asset"
              }
            ]
          }
        },
        {
          "name": "newOwner",
          "docs": [
            "The new owner — must currently hold the Metaplex Core Asset."
          ],
          "signer": true
        },
        {
          "name": "asset",
          "docs": [
            "The Metaplex Core Asset (the agent NFT).",
            "Must match `agent_identity.nft_mint` and be owned by Metaplex Core program."
          ]
        }
      ],
      "args": []
    },
    {
      "name": "closeReceipt",
      "discriminator": [
        126,
        254,
        244,
        203,
        124,
        164,
        134,
        89
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true,
          "relations": [
            "receipt"
          ]
        },
        {
          "name": "receipt",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "createDelegation",
      "discriminator": [
        177,
        165,
        93,
        55,
        227,
        163,
        61,
        175
      ],
      "accounts": [
        {
          "name": "delegator",
          "writable": true,
          "signer": true
        },
        {
          "name": "delegate"
        },
        {
          "name": "nftMint",
          "docs": [
            "The agent NFT mint (asset address)"
          ]
        },
        {
          "name": "agentIdentity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ]
          }
        },
        {
          "name": "delegation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "delegator"
              },
              {
                "kind": "account",
                "path": "delegate"
              },
              {
                "kind": "account",
                "path": "agent_identity.delegation_count",
                "account": "agentIdentity"
              }
            ]
          }
        },
        {
          "name": "parentDelegation",
          "docs": [
            "Optional parent delegation for sub-delegation.",
            "Must be provided when delegator is not the agent owner.",
            "v1 note: revoking a parent does NOT cascade to children.",
            "SDK/API layer should cascade-revoke children off-chain.",
            "owner_version invalidation (via NFT transfer) is the canonical on-chain revocation."
          ],
          "optional": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "canTransact",
          "type": "bool"
        },
        {
          "name": "canGiveFeedback",
          "type": "bool"
        },
        {
          "name": "canUpdateMetadata",
          "type": "bool"
        },
        {
          "name": "canUpdatePricing",
          "type": "bool"
        },
        {
          "name": "canRegisterServices",
          "type": "bool"
        },
        {
          "name": "canManage",
          "type": "bool"
        },
        {
          "name": "canRedelegate",
          "type": "bool"
        },
        {
          "name": "maxSpendPerTx",
          "type": "u64"
        },
        {
          "name": "maxSpendTotal",
          "type": "u64"
        },
        {
          "name": "allowedTokens",
          "type": {
            "vec": "pubkey"
          }
        },
        {
          "name": "allowedPrograms",
          "type": {
            "vec": "pubkey"
          }
        },
        {
          "name": "expiresAt",
          "type": "i64"
        },
        {
          "name": "usesRemaining",
          "type": "u64"
        }
      ]
    },
    {
      "name": "fundDelegation",
      "discriminator": [
        119,
        89,
        141,
        183,
        6,
        48,
        243,
        11
      ],
      "accounts": [
        {
          "name": "delegator",
          "writable": true,
          "signer": true
        },
        {
          "name": "delegation"
        },
        {
          "name": "tokenMint"
        },
        {
          "name": "delegatorTokenAccount",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "delegation"
              }
            ]
          }
        },
        {
          "name": "vaultAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "delegation"
              }
            ]
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deactivateAgent",
      "discriminator": [
        205,
        171,
        239,
        225,
        82,
        126,
        96,
        166
      ],
      "accounts": [
        {
          "name": "agentIdentity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "agent_identity.nft_mint",
                "account": "agentIdentity"
              }
            ]
          }
        },
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "agentIdentity"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "giveFeedback",
      "discriminator": [
        145,
        136,
        123,
        3,
        215,
        165,
        98,
        41
      ],
      "accounts": [
        {
          "name": "reviewer",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "agent",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ]
          }
        },
        {
          "name": "nftMint"
        },
        {
          "name": "feedbackEntry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  100,
                  98,
                  97,
                  99,
                  107
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              },
              {
                "kind": "account",
                "path": "reviewer"
              },
              {
                "kind": "arg",
                "path": "feedbackNonce"
              }
            ]
          }
        },
        {
          "name": "paymentReceipt",
          "docs": [
            "Optional PaymentReceipt PDA — proves the reviewer paid for the agent's service.",
            "If provided, the receipt is verified and auto-closed (rent returned to reviewer).",
            "One receipt = one verified review. Prevents reuse."
          ],
          "writable": true,
          "optional": true
        },
        {
          "name": "instructionsSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "score",
          "type": "u8"
        },
        {
          "name": "tag1",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "tag2",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "detailUri",
          "type": "string"
        },
        {
          "name": "detailHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "feedbackAuth",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        },
        {
          "name": "feedbackNonce",
          "type": "i64"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "docs": [
            "The deployer who becomes protocol authority."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "collection",
          "docs": [
            "New Metaplex Core Collection account (keypair generated client-side)."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "registrationFee",
          "type": "u64"
        },
        {
          "name": "settlementFeeBps",
          "type": "u16"
        },
        {
          "name": "feeTreasury",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "reactivateAgent",
      "discriminator": [
        231,
        7,
        179,
        97,
        210,
        24,
        209,
        12
      ],
      "accounts": [
        {
          "name": "agentIdentity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "agent_identity.nft_mint",
                "account": "agentIdentity"
              }
            ]
          }
        },
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "agentIdentity"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "registerAgent",
      "discriminator": [
        135,
        157,
        66,
        195,
        2,
        113,
        175,
        30
      ],
      "accounts": [
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "configAuthority",
          "docs": [
            "Collection update authority — must match `config.authority`."
          ],
          "signer": true
        },
        {
          "name": "agentIdentity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "asset"
              }
            ]
          }
        },
        {
          "name": "owner",
          "docs": [
            "Agent owner / payer for registration."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "asset",
          "docs": [
            "New Metaplex Core Asset account (keypair generated client-side)."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "collection",
          "docs": [
            "The Metaplex Core Collection this agent NFT belongs to.",
            "Must match `config.collection`."
          ],
          "writable": true
        },
        {
          "name": "feeTreasury",
          "docs": [
            "Treasury receiving the registration fee."
          ],
          "writable": true
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "metadataUri",
          "type": "string"
        },
        {
          "name": "metadataHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "feedbackAuthority",
          "type": "pubkey"
        },
        {
          "name": "tags",
          "type": {
            "vec": {
              "array": [
                "u8",
                32
              ]
            }
          }
        }
      ]
    },
    {
      "name": "removeService",
      "discriminator": [
        19,
        102,
        8,
        231,
        40,
        141,
        9,
        110
      ],
      "accounts": [
        {
          "name": "caller",
          "writable": true,
          "signer": true
        },
        {
          "name": "agent",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ]
          }
        },
        {
          "name": "nftMint",
          "relations": [
            "service"
          ]
        },
        {
          "name": "service",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  101,
                  114,
                  118,
                  105,
                  99,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              },
              {
                "kind": "account",
                "path": "service.service_type",
                "account": "agentService"
              }
            ]
          }
        },
        {
          "name": "delegation",
          "docs": [
            "Optional delegation for delegate callers"
          ],
          "optional": true
        }
      ],
      "args": []
    },
    {
      "name": "revokeDelegation",
      "discriminator": [
        188,
        92,
        135,
        67,
        160,
        181,
        54,
        62
      ],
      "accounts": [
        {
          "name": "caller",
          "signer": true
        },
        {
          "name": "nftMint"
        },
        {
          "name": "agentIdentity",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ]
          }
        },
        {
          "name": "delegation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "delegation.delegator",
                "account": "delegation"
              },
              {
                "kind": "account",
                "path": "delegation.delegate",
                "account": "delegation"
              },
              {
                "kind": "account",
                "path": "delegation.delegation_id",
                "account": "delegation"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "revokeFeedback",
      "discriminator": [
        211,
        37,
        230,
        82,
        118,
        216,
        137,
        206
      ],
      "accounts": [
        {
          "name": "reviewer",
          "signer": true
        },
        {
          "name": "agent",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "feedback_entry.nft_mint",
                "account": "feedbackEntry"
              }
            ]
          }
        },
        {
          "name": "feedbackEntry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  100,
                  98,
                  97,
                  99,
                  107
                ]
              },
              {
                "kind": "account",
                "path": "feedback_entry.nft_mint",
                "account": "feedbackEntry"
              },
              {
                "kind": "account",
                "path": "feedback_entry.reviewer",
                "account": "feedbackEntry"
              },
              {
                "kind": "account",
                "path": "feedback_entry.created_at",
                "account": "feedbackEntry"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "setFeedbackAuthority",
      "discriminator": [
        147,
        190,
        232,
        190,
        80,
        77,
        59,
        84
      ],
      "accounts": [
        {
          "name": "agentIdentity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "agent_identity.nft_mint",
                "account": "agentIdentity"
              }
            ]
          }
        },
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "agentIdentity"
          ]
        }
      ],
      "args": [
        {
          "name": "newAuthority",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setPaymentRequirement",
      "discriminator": [
        42,
        187,
        23,
        82,
        227,
        29,
        217,
        250
      ],
      "accounts": [
        {
          "name": "caller",
          "writable": true,
          "signer": true
        },
        {
          "name": "nftMint"
        },
        {
          "name": "agentIdentity",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ]
          }
        },
        {
          "name": "paymentRequirement",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  121,
                  109,
                  101,
                  110,
                  116,
                  95,
                  114,
                  101,
                  113
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              },
              {
                "kind": "arg",
                "path": "serviceType"
              }
            ]
          }
        },
        {
          "name": "delegation",
          "docs": [
            "Optional delegation account for delegate callers"
          ],
          "optional": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "serviceType",
          "type": {
            "defined": {
              "name": "serviceType"
            }
          }
        },
        {
          "name": "scheme",
          "type": {
            "defined": {
              "name": "paymentScheme"
            }
          }
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "tokenMint",
          "type": "pubkey"
        },
        {
          "name": "payTo",
          "type": "pubkey"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "resource",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateAgentMetadata",
      "discriminator": [
        80,
        63,
        141,
        214,
        125,
        25,
        174,
        106
      ],
      "accounts": [
        {
          "name": "agentIdentity",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "agent_identity.nft_mint",
                "account": "agentIdentity"
              }
            ]
          }
        },
        {
          "name": "caller",
          "signer": true
        },
        {
          "name": "delegation",
          "docs": [
            "Optional delegation account. Required when caller != owner."
          ],
          "optional": true
        }
      ],
      "args": [
        {
          "name": "newUri",
          "type": "string"
        },
        {
          "name": "newHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "updateConfig",
      "discriminator": [
        29,
        158,
        252,
        191,
        10,
        83,
        219,
        99
      ],
      "accounts": [
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "config"
          ]
        }
      ],
      "args": [
        {
          "name": "newFee",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "newSettlementFeeBps",
          "type": {
            "option": "u16"
          }
        },
        {
          "name": "newTreasury",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "newAuthority",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "newFacilitator",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "pauseIdentity",
          "type": {
            "option": "bool"
          }
        },
        {
          "name": "pauseReputation",
          "type": {
            "option": "bool"
          }
        },
        {
          "name": "pauseValidation",
          "type": {
            "option": "bool"
          }
        },
        {
          "name": "pauseDelegation",
          "type": {
            "option": "bool"
          }
        },
        {
          "name": "pausePayments",
          "type": {
            "option": "bool"
          }
        }
      ]
    },
    {
      "name": "updatePaymentRequirement",
      "discriminator": [
        109,
        132,
        28,
        12,
        254,
        80,
        242,
        170
      ],
      "accounts": [
        {
          "name": "caller",
          "signer": true
        },
        {
          "name": "nftMint"
        },
        {
          "name": "agentIdentity",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ]
          }
        },
        {
          "name": "paymentRequirement",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  121,
                  109,
                  101,
                  110,
                  116,
                  95,
                  114,
                  101,
                  113
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              },
              {
                "kind": "account",
                "path": "payment_requirement.service_type",
                "account": "paymentRequirement"
              }
            ]
          }
        },
        {
          "name": "delegation",
          "docs": [
            "Optional delegation account for delegate callers"
          ],
          "optional": true
        }
      ],
      "args": [
        {
          "name": "newAmount",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "newPayTo",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "newDescription",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "newActive",
          "type": {
            "option": "bool"
          }
        }
      ]
    },
    {
      "name": "updateService",
      "discriminator": [
        46,
        169,
        26,
        33,
        191,
        78,
        40,
        221
      ],
      "accounts": [
        {
          "name": "caller",
          "signer": true
        },
        {
          "name": "agent",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ]
          }
        },
        {
          "name": "nftMint",
          "relations": [
            "service"
          ]
        },
        {
          "name": "service",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  101,
                  114,
                  118,
                  105,
                  99,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              },
              {
                "kind": "account",
                "path": "service.service_type",
                "account": "agentService"
              }
            ]
          }
        },
        {
          "name": "delegation",
          "docs": [
            "Optional delegation for delegate callers"
          ],
          "optional": true
        }
      ],
      "args": [
        {
          "name": "newEndpoint",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "newVersion",
          "type": {
            "option": "string"
          }
        }
      ]
    },
    {
      "name": "validationRequest",
      "discriminator": [
        4,
        80,
        247,
        116,
        126,
        161,
        170,
        65
      ],
      "accounts": [
        {
          "name": "caller",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "agent",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ]
          }
        },
        {
          "name": "nftMint"
        },
        {
          "name": "validationRequest",
          "writable": true
        },
        {
          "name": "delegation",
          "docs": [
            "Optional delegation for delegate callers"
          ],
          "optional": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "validator",
          "type": "pubkey"
        },
        {
          "name": "requestHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "tag",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "requestUri",
          "type": "string"
        }
      ]
    },
    {
      "name": "validationResponse",
      "discriminator": [
        151,
        33,
        222,
        44,
        230,
        69,
        231,
        9
      ],
      "accounts": [
        {
          "name": "validator",
          "writable": true,
          "signer": true
        },
        {
          "name": "agent",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "validation_request.nft_mint",
                "account": "validationRequest"
              }
            ]
          }
        },
        {
          "name": "validationRequest",
          "writable": true
        },
        {
          "name": "validationResponse",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "score",
          "type": "u8"
        },
        {
          "name": "tag",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "evidenceUri",
          "type": "string"
        },
        {
          "name": "evidenceHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "verifyAndSettle",
      "discriminator": [
        211,
        142,
        20,
        22,
        134,
        232,
        64,
        101
      ],
      "accounts": [
        {
          "name": "payer",
          "docs": [
            "For Atomic mode: the payer signs. For Delegated/Attestation: does not need to sign."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "nftMint"
        },
        {
          "name": "agentIdentity",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ]
          }
        },
        {
          "name": "paymentRequirement",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  121,
                  109,
                  101,
                  110,
                  116,
                  95,
                  114,
                  101,
                  113
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              },
              {
                "kind": "account",
                "path": "payment_requirement.service_type",
                "account": "paymentRequirement"
              }
            ]
          }
        },
        {
          "name": "payerTokenAccount",
          "writable": true
        },
        {
          "name": "payeeTokenAccount",
          "writable": true
        },
        {
          "name": "treasuryTokenAccount",
          "writable": true
        },
        {
          "name": "tokenMint"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "paymentReceipt",
          "docs": [
            "PaymentReceipt PDA — created on settlement to prove payment happened.",
            "Can later be consumed by give_feedback (auto-closed) or close_receipt (manual)."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  99,
                  101,
                  105,
                  112,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "paymentId"
              }
            ]
          }
        },
        {
          "name": "facilitator",
          "docs": [
            "Optional facilitator signer — required for Delegated mode.",
            "This account must have SPL delegate authority on payer_token_account."
          ],
          "signer": true,
          "optional": true
        },
        {
          "name": "delegation",
          "docs": [
            "Optional delegation account — required for Delegated mode."
          ],
          "writable": true,
          "optional": true
        },
        {
          "name": "vault",
          "docs": [
            "Optional vault token account for vault delegation mode.",
            "Seeds derived from delegation key — only valid when delegation is also provided."
          ],
          "writable": true,
          "optional": true
        },
        {
          "name": "vaultAuthority",
          "docs": [
            "Seeds: [b\"vault_authority\", delegation.key().as_ref()]"
          ],
          "optional": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "paymentId",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "txSignature",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "resource",
          "type": "string"
        },
        {
          "name": "settlementMode",
          "type": {
            "defined": {
              "name": "settlementMode"
            }
          }
        }
      ]
    },
    {
      "name": "withdrawDelegation",
      "discriminator": [
        198,
        233,
        141,
        169,
        204,
        178,
        110,
        250
      ],
      "accounts": [
        {
          "name": "caller",
          "writable": true,
          "signer": true
        },
        {
          "name": "nftMint"
        },
        {
          "name": "agentIdentity",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ]
          }
        },
        {
          "name": "delegation"
        },
        {
          "name": "tokenMint"
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "delegation"
              }
            ]
          }
        },
        {
          "name": "vaultAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "delegation"
              }
            ]
          }
        },
        {
          "name": "recipientTokenAccount",
          "docs": [
            "Recipient token account — must be owned by the caller"
          ],
          "writable": true
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "agentIdentity",
      "discriminator": [
        11,
        149,
        31,
        27,
        186,
        76,
        241,
        72
      ]
    },
    {
      "name": "agentService",
      "discriminator": [
        27,
        120,
        44,
        60,
        134,
        122,
        164,
        136
      ]
    },
    {
      "name": "delegation",
      "discriminator": [
        237,
        90,
        140,
        159,
        124,
        255,
        243,
        80
      ]
    },
    {
      "name": "feedbackEntry",
      "discriminator": [
        203,
        62,
        143,
        114,
        243,
        30,
        218,
        29
      ]
    },
    {
      "name": "paymentReceipt",
      "discriminator": [
        168,
        198,
        209,
        4,
        60,
        235,
        126,
        109
      ]
    },
    {
      "name": "paymentRequirement",
      "discriminator": [
        209,
        174,
        251,
        78,
        52,
        39,
        205,
        30
      ]
    },
    {
      "name": "protocolConfig",
      "discriminator": [
        207,
        91,
        250,
        28,
        152,
        179,
        215,
        209
      ]
    },
    {
      "name": "validationRequest",
      "discriminator": [
        130,
        174,
        153,
        111,
        74,
        241,
        40,
        140
      ]
    },
    {
      "name": "validationResponse",
      "discriminator": [
        146,
        167,
        252,
        222,
        192,
        143,
        244,
        20
      ]
    }
  ],
  "events": [
    {
      "name": "agentClaimed",
      "discriminator": [
        247,
        245,
        225,
        158,
        168,
        67,
        121,
        236
      ]
    },
    {
      "name": "agentDeactivated",
      "discriminator": [
        138,
        251,
        82,
        87,
        119,
        148,
        20,
        180
      ]
    },
    {
      "name": "agentReactivated",
      "discriminator": [
        23,
        241,
        7,
        252,
        229,
        96,
        117,
        217
      ]
    },
    {
      "name": "agentRegistered",
      "discriminator": [
        191,
        78,
        217,
        54,
        232,
        100,
        189,
        85
      ]
    },
    {
      "name": "delegationCreated",
      "discriminator": [
        20,
        93,
        12,
        34,
        227,
        63,
        100,
        136
      ]
    },
    {
      "name": "delegationRevoked",
      "discriminator": [
        59,
        158,
        142,
        49,
        164,
        116,
        220,
        8
      ]
    },
    {
      "name": "feedbackAuthorityUpdated",
      "discriminator": [
        161,
        201,
        86,
        12,
        121,
        88,
        236,
        66
      ]
    },
    {
      "name": "feedbackGiven",
      "discriminator": [
        64,
        65,
        2,
        152,
        174,
        215,
        156,
        194
      ]
    },
    {
      "name": "feedbackRevoked",
      "discriminator": [
        205,
        16,
        31,
        94,
        54,
        101,
        16,
        199
      ]
    },
    {
      "name": "metadataUpdated",
      "discriminator": [
        132,
        36,
        215,
        246,
        166,
        90,
        189,
        44
      ]
    },
    {
      "name": "paymentRequirementSet",
      "discriminator": [
        77,
        137,
        124,
        9,
        75,
        242,
        137,
        100
      ]
    },
    {
      "name": "paymentSettled",
      "discriminator": [
        158,
        182,
        152,
        76,
        105,
        23,
        232,
        135
      ]
    },
    {
      "name": "serviceAdded",
      "discriminator": [
        7,
        54,
        38,
        155,
        50,
        244,
        118,
        57
      ]
    },
    {
      "name": "serviceRemoved",
      "discriminator": [
        32,
        67,
        70,
        19,
        50,
        103,
        29,
        221
      ]
    },
    {
      "name": "serviceUpdated",
      "discriminator": [
        184,
        118,
        4,
        188,
        134,
        109,
        194,
        235
      ]
    },
    {
      "name": "validationRequested",
      "discriminator": [
        133,
        42,
        252,
        198,
        82,
        135,
        183,
        65
      ]
    },
    {
      "name": "validationResponded",
      "discriminator": [
        93,
        63,
        246,
        101,
        212,
        208,
        53,
        167
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "metadataUriTooLong",
      "msg": "Metadata URI exceeds maximum length of 200 characters"
    },
    {
      "code": 6001,
      "name": "versionTooLong",
      "msg": "Version string exceeds maximum length of 20 characters"
    },
    {
      "code": 6002,
      "name": "descriptionTooLong",
      "msg": "Description exceeds maximum length of 200 characters"
    },
    {
      "code": 6003,
      "name": "resourceTooLong",
      "msg": "Resource path exceeds maximum length of 200 characters"
    },
    {
      "code": 6004,
      "name": "endpointTooLong",
      "msg": "Endpoint URL exceeds maximum length of 200 characters"
    },
    {
      "code": 6005,
      "name": "invalidFeedbackScore",
      "msg": "Feedback score must be between 0 and 100"
    },
    {
      "code": 6006,
      "name": "invalidValidationScore",
      "msg": "Validation score must be between 0 and 100"
    },
    {
      "code": 6007,
      "name": "tooManyTags",
      "msg": "Too many tags (maximum 5)"
    },
    {
      "code": 6008,
      "name": "tooManyAllowedTokens",
      "msg": "Too many allowed tokens (maximum 5)"
    },
    {
      "code": 6009,
      "name": "tooManyAllowedPrograms",
      "msg": "Too many allowed programs (maximum 5)"
    },
    {
      "code": 6010,
      "name": "agentInactive",
      "msg": "Agent is not active"
    },
    {
      "code": 6011,
      "name": "agentAlreadyActive",
      "msg": "Agent is already active"
    },
    {
      "code": 6012,
      "name": "unauthorized",
      "msg": "Unauthorized: caller is not the owner and has no valid delegation"
    },
    {
      "code": 6013,
      "name": "invalidFeedbackAuth",
      "msg": "Invalid feedback authorization signature"
    },
    {
      "code": 6014,
      "name": "feedbackAlreadyRevoked",
      "msg": "Feedback already revoked"
    },
    {
      "code": 6015,
      "name": "delegationInactive",
      "msg": "Delegation is not active"
    },
    {
      "code": 6016,
      "name": "delegationExpired",
      "msg": "Delegation has expired"
    },
    {
      "code": 6017,
      "name": "delegationExhausted",
      "msg": "Delegation has no remaining uses"
    },
    {
      "code": 6018,
      "name": "insufficientPermission",
      "msg": "Delegation does not have the required permission"
    },
    {
      "code": 6019,
      "name": "exceedsPerTxLimit",
      "msg": "Transaction amount exceeds delegation per-transaction limit"
    },
    {
      "code": 6020,
      "name": "exceedsTotalLimit",
      "msg": "Cumulative spend would exceed delegation total limit"
    },
    {
      "code": 6021,
      "name": "tokenNotAllowed",
      "msg": "Token not allowed by delegation constraints"
    },
    {
      "code": 6022,
      "name": "programNotAllowed",
      "msg": "Program not allowed by delegation constraints"
    },
    {
      "code": 6023,
      "name": "subDelegationExceedsParent",
      "msg": "Sub-delegation constraints must be within parent constraints"
    },
    {
      "code": 6024,
      "name": "cannotRedelegate",
      "msg": "Delegator cannot redelegate (can_redelegate is false)"
    },
    {
      "code": 6025,
      "name": "maxDelegationDepthExceeded",
      "msg": "Maximum delegation depth exceeded (max 3 levels)"
    },
    {
      "code": 6026,
      "name": "delegationOwnerVersionMismatch",
      "msg": "Delegation owner_version does not match agent (NFT was transferred)"
    },
    {
      "code": 6027,
      "name": "paymentRequirementInactive",
      "msg": "Payment requirement is not active"
    },
    {
      "code": 6028,
      "name": "insufficientPayment",
      "msg": "Payment amount is insufficient"
    },
    {
      "code": 6029,
      "name": "paymentReplay",
      "msg": "Payment ID already used (replay detected)"
    },
    {
      "code": 6030,
      "name": "serviceAlreadyExists",
      "msg": "Service type already registered for this agent"
    },
    {
      "code": 6031,
      "name": "notNftHolder",
      "msg": "Caller does not hold the agent NFT"
    },
    {
      "code": 6032,
      "name": "validationAlreadyResponded",
      "msg": "Validation request already responded"
    },
    {
      "code": 6033,
      "name": "validatorMismatch",
      "msg": "Validator does not match the validation request"
    },
    {
      "code": 6034,
      "name": "modulePaused",
      "msg": "Protocol module is paused"
    },
    {
      "code": 6035,
      "name": "settlementFeeTooHigh",
      "msg": "Settlement fee basis points exceeds maximum (1000 = 10%)"
    },
    {
      "code": 6036,
      "name": "insufficientRegistrationFee",
      "msg": "Insufficient SOL for registration fee"
    },
    {
      "code": 6037,
      "name": "delegationRequiredForDelegatedMode",
      "msg": "Delegated settlement requires a delegation account"
    },
    {
      "code": 6038,
      "name": "facilitatorRequired",
      "msg": "Delegated settlement requires facilitator as signer with SPL delegate authority"
    },
    {
      "code": 6039,
      "name": "facilitatorNotApproved",
      "msg": "Facilitator is not an approved SPL Token delegate on the payer's token account"
    },
    {
      "code": 6040,
      "name": "insufficientDelegateAllowance",
      "msg": "SPL Token delegate allowance insufficient for this transfer"
    },
    {
      "code": 6041,
      "name": "ed25519InstructionNotFound",
      "msg": "Ed25519 program instruction not found in transaction"
    },
    {
      "code": 6042,
      "name": "invalidEd25519InstructionData",
      "msg": "Invalid Ed25519 instruction data"
    },
    {
      "code": 6043,
      "name": "tokenMintMismatch",
      "msg": "Token mint does not match payment requirement or token accounts"
    },
    {
      "code": 6044,
      "name": "paymentAmountMismatch",
      "msg": "Payment amount does not match exact requirement"
    },
    {
      "code": 6045,
      "name": "mathOverflow",
      "msg": "Arithmetic overflow"
    },
    {
      "code": 6046,
      "name": "attestationUnauthorized",
      "msg": "Attestation mode requires protocol authority or facilitator"
    },
    {
      "code": 6047,
      "name": "payToRedirectNotAllowed",
      "msg": "Delegates cannot redirect payment destination away from agent owner"
    },
    {
      "code": 6048,
      "name": "receiptNotSettled",
      "msg": "Payment receipt has not been settled"
    },
    {
      "code": 6049,
      "name": "receiptAgentMismatch",
      "msg": "Payment receipt agent does not match feedback target"
    },
    {
      "code": 6050,
      "name": "receiptPayerMismatch",
      "msg": "Payment receipt payer does not match reviewer"
    }
  ],
  "types": [
    {
      "name": "agentClaimed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "oldOwner",
            "type": "pubkey"
          },
          {
            "name": "newOwner",
            "type": "pubkey"
          },
          {
            "name": "newOwnerVersion",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "agentDeactivated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "agentIdentity",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "docs": [
              "Metaplex Core Asset address — THIS IS THE AGENT ID"
            ],
            "type": "pubkey"
          },
          {
            "name": "owner",
            "docs": [
              "Authority that controls this agent (current NFT holder)"
            ],
            "type": "pubkey"
          },
          {
            "name": "ownerVersion",
            "docs": [
              "Incremented on claim_agent, invalidates all delegations"
            ],
            "type": "u64"
          },
          {
            "name": "feedbackAuthority",
            "docs": [
              "Separate keypair for signing feedback authorizations"
            ],
            "type": "pubkey"
          },
          {
            "name": "metadataUri",
            "docs": [
              "URI to registration file (max 200 chars) — A2A Agent Card format"
            ],
            "type": "string"
          },
          {
            "name": "metadataHash",
            "docs": [
              "SHA-256 of the registration file content"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "tags",
            "docs": [
              "Categorical tag hashes, max 5 (e.g., keccak256(\"defi\"))"
            ],
            "type": {
              "vec": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          },
          {
            "name": "active",
            "docs": [
              "Can be deactivated by owner"
            ],
            "type": "bool"
          },
          {
            "name": "createdAt",
            "docs": [
              "Unix timestamp"
            ],
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "docs": [
              "Unix timestamp"
            ],
            "type": "i64"
          },
          {
            "name": "verifiedFeedbackCount",
            "docs": [
              "Feedback entries WITH payment proof"
            ],
            "type": "u64"
          },
          {
            "name": "verifiedScoreSum",
            "docs": [
              "Sum of scores from verified feedback (0-100 each)"
            ],
            "type": "u64"
          },
          {
            "name": "unverifiedFeedbackCount",
            "docs": [
              "Feedback entries WITHOUT payment proof"
            ],
            "type": "u64"
          },
          {
            "name": "unverifiedScoreSum",
            "docs": [
              "Sum of scores from unverified feedback (0-100 each)"
            ],
            "type": "u64"
          },
          {
            "name": "validationCount",
            "docs": [
              "Total validations received"
            ],
            "type": "u64"
          },
          {
            "name": "delegationCount",
            "docs": [
              "Counter for delegation IDs (auto-increment per agent)"
            ],
            "type": "u64"
          },
          {
            "name": "bump",
            "docs": [
              "PDA bump"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "agentReactivated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "agentRegistered",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "metadataUri",
            "type": "string"
          },
          {
            "name": "feedbackAuthority",
            "type": "pubkey"
          },
          {
            "name": "tags",
            "type": {
              "vec": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "agentService",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "docs": [
              "Parent agent (NFT mint / asset address)"
            ],
            "type": "pubkey"
          },
          {
            "name": "serviceType",
            "docs": [
              "Service type enum"
            ],
            "type": {
              "defined": {
                "name": "serviceType"
              }
            }
          },
          {
            "name": "endpoint",
            "docs": [
              "URL (max 200 chars)"
            ],
            "type": "string"
          },
          {
            "name": "version",
            "docs": [
              "Version string (max 20 chars)"
            ],
            "type": "string"
          },
          {
            "name": "active",
            "type": "bool"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "delegation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "delegationId",
            "docs": [
              "Unique ID (from agent's delegation_count)"
            ],
            "type": "u64"
          },
          {
            "name": "delegator",
            "docs": [
              "Who is granting permissions"
            ],
            "type": "pubkey"
          },
          {
            "name": "delegate",
            "docs": [
              "Who receives permissions"
            ],
            "type": "pubkey"
          },
          {
            "name": "nftMint",
            "docs": [
              "Agent context (NFT mint / asset address)"
            ],
            "type": "pubkey"
          },
          {
            "name": "ownerVersion",
            "docs": [
              "Stored at creation, verified at redemption"
            ],
            "type": "u64"
          },
          {
            "name": "canTransact",
            "docs": [
              "Spend tokens on behalf of agent"
            ],
            "type": "bool"
          },
          {
            "name": "canGiveFeedback",
            "docs": [
              "Submit feedback as agent"
            ],
            "type": "bool"
          },
          {
            "name": "canUpdateMetadata",
            "docs": [
              "Update agent metadata URI/hash"
            ],
            "type": "bool"
          },
          {
            "name": "canUpdatePricing",
            "docs": [
              "Change payment requirements"
            ],
            "type": "bool"
          },
          {
            "name": "canRegisterServices",
            "docs": [
              "Add/remove/update services"
            ],
            "type": "bool"
          },
          {
            "name": "canManage",
            "docs": [
              "All permissions except transfer ownership"
            ],
            "type": "bool"
          },
          {
            "name": "canRedelegate",
            "docs": [
              "Create sub-delegations"
            ],
            "type": "bool"
          },
          {
            "name": "maxSpendPerTx",
            "docs": [
              "Max tokens per transaction (0 = no limit)"
            ],
            "type": "u64"
          },
          {
            "name": "maxSpendTotal",
            "docs": [
              "Max cumulative tokens (0 = no limit)"
            ],
            "type": "u64"
          },
          {
            "name": "spentTotal",
            "docs": [
              "Current cumulative spend"
            ],
            "type": "u64"
          },
          {
            "name": "allowedTokens",
            "docs": [
              "Allowed token mints (empty = all) — max 5"
            ],
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "allowedPrograms",
            "docs": [
              "Allowed CPI targets (empty = all) — max 5"
            ],
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "expiresAt",
            "docs": [
              "Unix timestamp (0 = no expiry)"
            ],
            "type": "i64"
          },
          {
            "name": "usesRemaining",
            "docs": [
              "Remaining uses (0 = unlimited)"
            ],
            "type": "u64"
          },
          {
            "name": "totalUses",
            "docs": [
              "Total uses so far"
            ],
            "type": "u64"
          },
          {
            "name": "active",
            "type": "bool"
          },
          {
            "name": "parentDelegation",
            "docs": [
              "If this is a sub-delegation, points to parent Delegation PDA"
            ],
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "depth",
            "docs": [
              "Delegation depth (0 = direct from owner, 1 = sub, 2 = sub-sub) — MAX 2"
            ],
            "type": "u8"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "revokedAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "delegationCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "delegator",
            "type": "pubkey"
          },
          {
            "name": "delegate",
            "type": "pubkey"
          },
          {
            "name": "delegationId",
            "type": "u64"
          },
          {
            "name": "depth",
            "type": "u8"
          },
          {
            "name": "expiresAt",
            "type": "i64"
          },
          {
            "name": "maxSpendTotal",
            "type": "u64"
          },
          {
            "name": "ownerVersion",
            "type": "u64"
          },
          {
            "name": "isSubDelegation",
            "type": "bool"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "delegationRevoked",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "delegator",
            "type": "pubkey"
          },
          {
            "name": "delegate",
            "type": "pubkey"
          },
          {
            "name": "delegationId",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "feedbackAuthorityUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "oldAuthority",
            "type": "pubkey"
          },
          {
            "name": "newAuthority",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "feedbackEntry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "docs": [
              "Agent receiving feedback (NFT mint / asset address)"
            ],
            "type": "pubkey"
          },
          {
            "name": "reviewer",
            "docs": [
              "Who submitted the feedback"
            ],
            "type": "pubkey"
          },
          {
            "name": "score",
            "docs": [
              "Score 0-100 (ERC-8004 aligned)"
            ],
            "type": "u8"
          },
          {
            "name": "tag1",
            "docs": [
              "Categorical tag hash (e.g., keccak256(\"quality\"))"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "tag2",
            "docs": [
              "Second tag hash"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "authVerified",
            "docs": [
              "Ed25519 feedback auth was verified at submission"
            ],
            "type": "bool"
          },
          {
            "name": "hasPaymentProof",
            "docs": [
              "Whether payment proof is attached"
            ],
            "type": "bool"
          },
          {
            "name": "paymentAmount",
            "docs": [
              "Amount paid (0 if no proof)"
            ],
            "type": "u64"
          },
          {
            "name": "paymentToken",
            "docs": [
              "Token used for payment (Pubkey::default if no proof)"
            ],
            "type": "pubkey"
          },
          {
            "name": "revoked",
            "type": "bool"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "feedbackGiven",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "reviewer",
            "type": "pubkey"
          },
          {
            "name": "score",
            "type": "u8"
          },
          {
            "name": "tag1",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "tag2",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "hasPaymentProof",
            "type": "bool"
          },
          {
            "name": "paymentAmount",
            "type": "u64"
          },
          {
            "name": "detailUri",
            "type": "string"
          },
          {
            "name": "detailHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "feedbackAuth",
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "feedbackRevoked",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "reviewer",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "metadataUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "oldHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "newHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "newUri",
            "type": "string"
          },
          {
            "name": "updatedBy",
            "type": "pubkey"
          },
          {
            "name": "viaDelegation",
            "type": "bool"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "paymentReceipt",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "paymentId",
            "docs": [
              "Unique nonce (client-generated)"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "nftMint",
            "docs": [
              "Agent (NFT mint)"
            ],
            "type": "pubkey"
          },
          {
            "name": "payer",
            "type": "pubkey"
          },
          {
            "name": "payee",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "docs": [
              "Total amount paid by payer"
            ],
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "docs": [
              "Protocol fee deducted (settlement_fee_bps)"
            ],
            "type": "u64"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "txSignature",
            "docs": [
              "Solana tx signature of the SPL transfer"
            ],
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          },
          {
            "name": "resource",
            "docs": [
              "Which resource was paid for (max 200 chars)"
            ],
            "type": "string"
          },
          {
            "name": "settlementMode",
            "docs": [
              "How this was settled"
            ],
            "type": {
              "defined": {
                "name": "settlementMode"
              }
            }
          },
          {
            "name": "delegation",
            "docs": [
              "If Delegated mode: the Delegation PDA used"
            ],
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "settled",
            "type": "bool"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "paymentRequirement",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "docs": [
              "Agent (NFT mint / asset address)"
            ],
            "type": "pubkey"
          },
          {
            "name": "serviceType",
            "type": {
              "defined": {
                "name": "serviceType"
              }
            }
          },
          {
            "name": "scheme",
            "type": {
              "defined": {
                "name": "paymentScheme"
              }
            }
          },
          {
            "name": "amount",
            "docs": [
              "In token's smallest unit"
            ],
            "type": "u64"
          },
          {
            "name": "tokenMint",
            "docs": [
              "USDC, wrapped SOL, etc."
            ],
            "type": "pubkey"
          },
          {
            "name": "payTo",
            "docs": [
              "Destination wallet"
            ],
            "type": "pubkey"
          },
          {
            "name": "description",
            "docs": [
              "Human-readable (max 200 chars)"
            ],
            "type": "string"
          },
          {
            "name": "resource",
            "docs": [
              "API endpoint path (max 200 chars)"
            ],
            "type": "string"
          },
          {
            "name": "active",
            "type": "bool"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "paymentRequirementSet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "serviceType",
            "type": {
              "defined": {
                "name": "serviceType"
              }
            }
          },
          {
            "name": "scheme",
            "type": {
              "defined": {
                "name": "paymentScheme"
              }
            }
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "paymentScheme",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "exact"
          },
          {
            "name": "upTo"
          }
        ]
      }
    },
    {
      "name": "paymentSettled",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "paymentId",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "payer",
            "type": "pubkey"
          },
          {
            "name": "payee",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "docs": [
              "Total amount paid"
            ],
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "docs": [
              "Protocol fee deducted"
            ],
            "type": "u64"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "resource",
            "type": "string"
          },
          {
            "name": "settlementMode",
            "type": {
              "defined": {
                "name": "settlementMode"
              }
            }
          },
          {
            "name": "delegation",
            "docs": [
              "Delegation PDA if SettlementMode::Delegated"
            ],
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "delegationSpentTotal",
            "docs": [
              "Updated spent_total after this payment"
            ],
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "protocolConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "docs": [
              "Upgrade authority / admin"
            ],
            "type": "pubkey"
          },
          {
            "name": "collection",
            "docs": [
              "Metaplex Core Collection address (all agent NFTs belong to this collection)"
            ],
            "type": "pubkey"
          },
          {
            "name": "registrationFee",
            "docs": [
              "Fee in lamports charged on register_agent (starts at 0.05 SOL, adjustable via governance)"
            ],
            "type": "u64"
          },
          {
            "name": "settlementFeeBps",
            "docs": [
              "Basis points taken from each settlement (e.g., 300 = 3%). Max 1000 (10%)."
            ],
            "type": "u16"
          },
          {
            "name": "feeTreasury",
            "docs": [
              "Treasury wallet — receives registration fees + settlement fees"
            ],
            "type": "pubkey"
          },
          {
            "name": "facilitator",
            "docs": [
              "Trusted facilitator pubkey — authorized for attestation-mode settlements"
            ],
            "type": "pubkey"
          },
          {
            "name": "pauseIdentity",
            "type": "bool"
          },
          {
            "name": "pauseReputation",
            "type": "bool"
          },
          {
            "name": "pauseValidation",
            "type": "bool"
          },
          {
            "name": "pauseDelegation",
            "type": "bool"
          },
          {
            "name": "pausePayments",
            "type": "bool"
          },
          {
            "name": "bump",
            "docs": [
              "PDA bump"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "serviceAdded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "serviceType",
            "type": {
              "defined": {
                "name": "serviceType"
              }
            }
          },
          {
            "name": "endpoint",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "serviceRemoved",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "serviceType",
            "type": {
              "defined": {
                "name": "serviceType"
              }
            }
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "serviceType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "mcp"
          },
          {
            "name": "a2a"
          },
          {
            "name": "api"
          },
          {
            "name": "web"
          }
        ]
      }
    },
    {
      "name": "serviceUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "serviceType",
            "type": {
              "defined": {
                "name": "serviceType"
              }
            }
          },
          {
            "name": "newEndpoint",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "settlementMode",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "atomic"
          },
          {
            "name": "attestation"
          },
          {
            "name": "delegated"
          }
        ]
      }
    },
    {
      "name": "validationRequest",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "docs": [
              "Agent requesting validation (NFT mint)"
            ],
            "type": "pubkey"
          },
          {
            "name": "validator",
            "docs": [
              "Who is asked to validate"
            ],
            "type": "pubkey"
          },
          {
            "name": "requestHash",
            "docs": [
              "Hash of the validation request"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "tag",
            "docs": [
              "Categorical tag"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "responded",
            "docs": [
              "Whether validator has responded"
            ],
            "type": "bool"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "validationRequested",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "validator",
            "type": "pubkey"
          },
          {
            "name": "requestHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "tag",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "requestUri",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "validationResponded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "validator",
            "type": "pubkey"
          },
          {
            "name": "requestHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "score",
            "type": "u8"
          },
          {
            "name": "tag",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "evidenceUri",
            "type": "string"
          },
          {
            "name": "evidenceHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "validationResponse",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "docs": [
              "Agent validated (NFT mint)"
            ],
            "type": "pubkey"
          },
          {
            "name": "validator",
            "docs": [
              "Who validated"
            ],
            "type": "pubkey"
          },
          {
            "name": "requestHash",
            "docs": [
              "Links to ValidationRequest"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "score",
            "docs": [
              "Score 0-100 (ERC-8004)"
            ],
            "type": "u8"
          },
          {
            "name": "tag",
            "docs": [
              "Categorical tag"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
