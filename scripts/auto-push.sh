#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: scripts/auto-push.sh [-b <branch>] [-n] [-f] -m <message>

Options:
  -m <message>  Commit message to use (required).
  -b <branch>   Branch name to push; defaults to the current branch.
  -n            Dry run: show actions without executing git commands.
  -f            Allow empty commit if no staged changes are present.

Description:
  Stages all changes, creates a commit with the provided message, and pushes
  to the selected branch on the 'origin' remote. This script exits with an
  error if no origin remote exists or if no changes are available unless
  -f is provided.
USAGE
}

ensure_git_repo() {
  if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "Error: This script must be run inside a git repository." >&2
    exit 1
  fi
}

ensure_origin_remote() {
  if ! git remote get-url origin >/dev/null 2>&1; then
    echo "Error: No 'origin' remote configured. Please add a GitHub remote first." >&2
    exit 1
  fi
}

main() {
  local branch
  local commit_msg=""
  local dry_run=false
  local allow_empty=false

  branch=$(git rev-parse --abbrev-ref HEAD)

  while getopts ":m:b:nf" opt; do
    case "$opt" in
      m)
        commit_msg="$OPTARG"
        ;;
      b)
        branch="$OPTARG"
        ;;
      n)
        dry_run=true
        ;;
      f)
        allow_empty=true
        ;;
      *)
        usage
        exit 1
        ;;
    esac
  done

  if [[ -z "$commit_msg" ]]; then
    echo "Error: Commit message (-m) is required." >&2
    usage
    exit 1
  fi

  ensure_git_repo
  ensure_origin_remote

  echo "Preparing to push to branch '$branch' with message: $commit_msg"

  if $dry_run; then
    echo "[Dry Run] Would stage all changes (git add -A)."
  else
    git add -A
  fi

  if $dry_run; then
    echo "[Dry Run] Would check for changes to commit."
  else
    if git diff --cached --quiet && ! $allow_empty; then
      echo "No staged changes to commit. Use -f to allow an empty commit." >&2
      exit 1
    fi
  fi

  if $dry_run; then
    echo "[Dry Run] Would commit changes (git commit -m \"$commit_msg\"${allow_empty:+ --allow-empty})."
  else
    git commit -m "$commit_msg" ${allow_empty:+--allow-empty}
  fi

  if $dry_run; then
    echo "[Dry Run] Would push to origin $branch (git push origin $branch)."
  else
    git push origin "$branch"
  fi

  echo "Push completed successfully${dry_run:+ (dry run only)}."
}

main "$@"
