#!/bin/zsh
# Double-click this after dropping photos into the image folders.
# Drop as MANY photos as you like per folder, any name, any format (iPhone HEIC, jpg, png).
# This converts them, keeps ALL of them, rebuilds the gallery list, and publishes live.

# The guide moved to its own repo on 2026-07-29 — it is now the repo root,
# not a subfolder. This file lives inside the repo, so the path follows it.
REPO="$(cd "$(dirname "$0")" && pwd)"
DIR="$REPO"
cd "$REPO" || { echo "Repo folder not found."; exit 1; }

echo "Processing photos..."
zsh "$DIR/_gen-photos.sh"

git add images photos.js
if git diff --cached --quiet; then
  echo "No new or changed photos found."
else
  git commit -m "Update ShoreEx guide photos" >/dev/null
  git push origin main && echo "" && echo "✅ Done. Live in about a minute — then hard-refresh the page (Cmd+Shift+R)."
fi
echo ""
echo "You can close this window."
