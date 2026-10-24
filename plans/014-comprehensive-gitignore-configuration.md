# Plan 014: Expand .gitignore for Next.js 16, IDEs, OS, and Build Caches

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 4da7579..HEAD -- .gitignore`
> If `.gitignore` changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `4da7579`, 2026-10-24

## Why this matters

The repository currently possesses a minimal Next.js `.gitignore` file that omits Turbopack build caches (`.turbo`), distribution artifacts (`dist/`), Playwright/E2E test reports, editor workspace metadata (`.vscode`, `.idea`), Windows thumbnail caches (`Thumbs.db`, `Desktop.ini`), and generic log files. Without these exclusions, temporary developer artifacts, OS metadata, and IDE settings leak into working tree statuses and risk accidental commits. Expanding `.gitignore` ensures clean git working trees across Windows, macOS, and Linux developer environments.

## Current state

The root `.gitignore` file currently exists as follows:

```gitignore
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

Shortcomings in current state:
1. Missing `.turbo` (Next.js 16 Turbopack build cache).
2. Missing `dist/` production compile output.
3. Missing test reporter directories (`playwright-report/`, `test-results/`, `blob-report/`).
4. Missing IDE directories (`.idea/`, `.vscode/*` except project settings).
5. Missing Windows OS files (`Thumbs.db`, `Desktop.ini`, `ehthumbs.db`).
6. Missing exemption rule for `.env.example`.
7. Missing local temporary patterns (`*.local`, `.antigravity/`).

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Check git status | `git status --porcelain` | lists working tree state |
| Verify ignore | `git check-ignore -v .turbo dist .idea/workspace.xml Thumbs.db` | prints matching ignore rules |
| Typecheck | `npx tsc --noEmit` | exit 0, no errors |

## Scope

**In scope** (the only file you should modify):
- `.gitignore`

**Out of scope** (do NOT touch):
- `package.json`
- `package-lock.json`
- Any source file in `src/` or `public/`
- Tracked agent files under `.agents/`

## Git workflow

- Branch: `advisor/014-comprehensive-gitignore`
- Commit message: `chore(git): expand .gitignore for nextjs 16, ides, os files, and build caches`
- Do NOT push or open a PR unless instructed by the operator.

## Steps

### Step 1: Update `.gitignore` with comprehensive sections

Replace the content of `.gitignore` with organized, robust sections covering dependencies, Next.js 16/Turbopack, production builds, test reporters, environment configs, IDEs, OS artifacts, and local tool configs.

Target `.gitignore` content:

```gitignore
# Dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# Next.js & Turbopack
/.next/
/out/
/.turbo

# Production & Build outputs
/build
/dist

# Testing & Coverage
/coverage
/test-results/
/playwright-report/
/blob-report/

# Debug and Process Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
*.log

# Environment variables
.env*
!.env.example

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDEs and Editors
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
Thumbs.db:encryptable
Desktop.ini
$RECYCLE.BIN/

# Temporary / Local tool files
*.pem
*.local
.antigravity/

# AI Agent skills and lockfiles
.agents/
skills-lock.json

# Planning and Advisor handoff documents
plans/
advisor-plans/
```

**Verify**:
`git check-ignore -v .turbo dist .idea/misc.xml Thumbs.db playwright-report/`
→ Each path must match a line in `.gitignore`.

### Step 2: Ensure tracked files are not unintentionally untracked

Check that no currently tracked files are broken or uncommitted:

**Verify**:
`git status`
→ Shows only `.gitignore` modified (or untracked files properly ignored).

## Test plan

- Test 1: Verify ignoring a fake Turbopack folder:
  `git check-ignore .turbo/cache.json` → returns `.turbo/cache.json`
- Test 2: Verify ignoring Windows thumbnail cache:
  `git check-ignore Thumbs.db` → returns `Thumbs.db`
- Test 3: Verify ignoring JetBrains files:
  `git check-ignore .idea/workspace.xml` → returns `.idea/workspace.xml`
- Test 4: Verify `.env.example` remains tracked/allowlisted:
  `git check-ignore .env.example` → exits non-zero (not ignored)
- Test 5: Verify ignoring plans directory:
  `git check-ignore plans/099-test.md` → returns `plans/099-test.md`
- Test 6: Verify ignoring agent skills and lockfile:
  `git check-ignore .agents/skills/dummy/SKILL.md skills-lock.json` → returns both paths

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `.gitignore` contains rules for `.turbo`, `/dist`, `.idea/`, `.vscode/*`, `Thumbs.db`, `*.log`, `plans/`, `.agents/`, and `skills-lock.json`
- [ ] `git check-ignore -v .turbo Thumbs.db .idea/workspace.xml plans/dummy.md .agents/dummy skills-lock.json` exits 0 with matching rule references
- [ ] `npx tsc --noEmit` exits 0
- [ ] No files outside `.gitignore` (and `plans/README.md`) are modified
- [ ] `plans/README.md` status row updated to `DONE`

## STOP conditions

Stop and report back (do not improvise) if:
- Modifying `.gitignore` conflicts with any currently tracked files in `git ls-files`.
- Git syntax errors or unexpected behavior occur when evaluating `git check-ignore`.

## Maintenance notes

- If developers use alternative editors (e.g. Sublime Text, Emacs), corresponding patterns (`*.sublime-project`, `*~`) can be added without side effects.
- If `.env.example` is created in the future, the unignore rule `!.env.example` ensures it can be safely committed.
- **Note on `.agents/`**: Certain files in `.agents/skills/shadcn/` were already tracked in git history. Simply adding `.agents/` to `.gitignore` prevents *new* skill files (like `improve/` or `responsive-design/`) from showing up as untracked. If existing tracked files in `.agents/` should also be untracked from the repository, a separate `git rm -r --cached .agents` step is required.
- **Note on `plans/`**: Plans currently tracked in git will remain in history, but new plan files will be ignored by git unless force-added (`git add -f`).
