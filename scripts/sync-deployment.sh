#!/bin/bash
# Sync deployment addresses from program/deployments/<network>.json into SDK constants.
# Usage: bash scripts/sync-deployment.sh [devnet|mainnet]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SDK_DIR="$(dirname "$SCRIPT_DIR")"
PROGRAM_DIR="$SDK_DIR/../../program"
CONSTANTS_FILE="$SDK_DIR/src/constants.ts"

NETWORK="${1:-devnet}"
DEPLOY_FILE="$PROGRAM_DIR/deployments/${NETWORK}.json"

if [ ! -f "$DEPLOY_FILE" ]; then
  echo "Error: $DEPLOY_FILE not found. Run program/scripts/initialize.ts first."
  exit 1
fi

# Extract values from deployment JSON
COLLECTION=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$DEPLOY_FILE','utf8')).collection)")
FEE_TREASURY=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$DEPLOY_FILE','utf8')).feeTreasury)")
LIGHT_ALT=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$DEPLOY_FILE','utf8')).lightAlt)")

echo "Syncing $NETWORK deployment into SDK constants..."
echo "  collection:  $COLLECTION"
echo "  feeTreasury: $FEE_TREASURY"
echo "  lightAlt:    $LIGHT_ALT"

# Update the constants file using sed
# Replace null values for the target network block
if [[ "$OSTYPE" == "darwin"* ]]; then
  SED_FLAG=(-i '')
else
  SED_FLAG=(-i)
fi

# Use node for a reliable multi-line replacement
node -e "
const fs = require('fs');
const content = fs.readFileSync('$CONSTANTS_FILE', 'utf8');

const updated = content.replace(
  /($NETWORK: \\{[^}]*programId:[^,]*,)[^}]*(\\})/s,
  \`\\\$1
    collection: new PublicKey(\"$COLLECTION\"),
    feeTreasury: new PublicKey(\"$FEE_TREASURY\"),
    lightAlt: new PublicKey(\"$LIGHT_ALT\"),
  \\\$2\`
);

fs.writeFileSync('$CONSTANTS_FILE', updated);
"

echo "Done. Run 'pnpm build' in packages/sdk/ to rebuild."
