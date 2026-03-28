#!/bin/bash
set -euo pipefail

# Only run in remote Claude Code sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Derive the git proxy base URL from the hakd-site remote so it works
# across sessions even if the proxy port changes
HAKD_REMOTE=$(git -C "${CLAUDE_PROJECT_DIR:-/home/user/hakd-site}" remote get-url origin 2>/dev/null || echo "")

if [ -z "$HAKD_REMOTE" ]; then
  echo "Warning: Could not determine git proxy URL — skipping repo clones" >&2
  exit 0
fi

# Strip repo name to get base: http://local_proxy@127.0.0.1:PORT/git/ChristianBrown1989
PROXY_BASE="${HAKD_REMOTE%/hakd-site}"

# Ensure Projects directory exists
mkdir -p "$HOME/Projects"

declare -A REPOS=(
  ["nashville-water-damage"]="$HOME/Projects/nashville-water-damage"
  ["cincinnati-water-damage"]="$HOME/Projects/cincinnati-water-damage"
  ["jacksonville-water-damage"]="$HOME/Projects/jacksonville-water-damage"
  ["inboundai-site-"]="$HOME/Projects/inboundai-site"
)

for REPO_NAME in "${!REPOS[@]}"; do
  DEST="${REPOS[$REPO_NAME]}"
  if [ ! -d "$DEST/.git" ]; then
    echo "Cloning $REPO_NAME → $DEST"
    git clone "$PROXY_BASE/$REPO_NAME" "$DEST" || echo "Warning: Could not clone $REPO_NAME" >&2
  else
    echo "$REPO_NAME already present at $DEST — pulling latest"
    git -C "$DEST" pull --ff-only || echo "Warning: Could not pull $REPO_NAME" >&2
  fi
done

echo "Session start: all repos ready in $HOME/Projects/"
