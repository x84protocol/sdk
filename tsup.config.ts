import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
    },
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    external: [
      "@coral-xyz/anchor",
      "@solana/web3.js",
      "@solana/spl-token",
      "@metaplex-foundation/mpl-core",
    ],
  },
  {
    entry: {
      settlement: "src/settlement/index.ts",
    },
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    external: [
      "@coral-xyz/anchor",
      "@solana/web3.js",
      "@solana/spl-token",
    ],
  },
]);
