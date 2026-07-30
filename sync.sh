#!/usr/bin/env bash
# Copies the customer-facing docs from the Scope Planner app repo into content/.
#
# The APP REPO IS THE SOURCE OF TRUTH for these three files — edit them there, then run this and
# commit the result. Editing content/privacy.md or content/terms.md directly means the published
# policy and the policy in the app repo disagree, and the published one is the one customers are
# held to.
set -euo pipefail

APP_REPO="${1:-${SCOPE_PLANNER_PATH:-../scope-planner}}"

if [[ ! -f "$APP_REPO/PRIVACY.md" ]]; then
  echo "✗ Not a Scope Planner checkout: $APP_REPO" >&2
  echo "  usage: bash sync.sh /path/to/scope-planner" >&2
  echo "  or:    SCOPE_PLANNER_PATH=/path/to/scope-planner bash sync.sh" >&2
  exit 1
fi

cp "$APP_REPO/PRIVACY.md"          content/privacy.md
cp "$APP_REPO/TERMS.md"            content/terms.md
cp "$APP_REPO/docs/USER_GUIDE.md"  content/guide.md

echo "✓ synced privacy, terms and guide from $APP_REPO"
echo "  next: npm run build && git add -A && git commit"

if command -v git >/dev/null && git -C "$APP_REPO" rev-parse HEAD >/dev/null 2>&1; then
  echo "  source commit: $(git -C "$APP_REPO" rev-parse --short HEAD)"
fi
