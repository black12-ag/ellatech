#!/bin/bash
set -euo pipefail

REPO="/Users/munir/ellatech"
PUBLIC_URL="https://ellatech-inventory-munir.netlify.app"
COMMIT_MSG="${1:-chore: push latest updates and README public link}"

cd "$REPO"

# Ensure the public link is present near the top of README
if ! rg -n "^\*\*Public Link\*\*: " README.md >/dev/null 2>&1; then
  awk -v url="$PUBLIC_URL" 'NR==1{print; print ""; print "**Public Link**: [" url "](" url ")"; next}1' README.md > README.md.tmp
  mv README.md.tmp README.md
fi

# Update the Web App row in Live Demo table to the same public URL
perl -0777 -i -pe 's#\| \*\*Web App\*\* \| \[[^\]]+\]\([^\)]+\) \|#| **Web App** | ['"$PUBLIC_URL"']('"$PUBLIC_URL"') |#g' README.md

git add -A
if [ -d ".codex" ]; then
  git reset .codex >/dev/null 2>&1 || true
fi

if git diff --cached --quiet; then
  echo "No staged changes to commit."
  exit 0
fi

git commit -m "$COMMIT_MSG"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
git push origin "$BRANCH"

echo "Done: pushed $BRANCH and updated README link to $PUBLIC_URL"
