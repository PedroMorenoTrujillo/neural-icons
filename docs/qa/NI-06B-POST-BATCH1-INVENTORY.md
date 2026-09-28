# NI-06B — post-Batch-1 catalog inventory

**Result:** the NI-06 target is already met at the committed Batch 1 checkpoint. Batch 2 has zero families to add; no icon geometry or catalog records were changed for NI-06B.

## Checkpoint and counts

- Repository: `neural-icons`
- Branch: `codex/ni-06-catalog-expansion`
- Batch 1 commit: `3e9bd23ae140aaf4f8712f619314b8e23e9cbbda`
- Parent / pre-expansion checkpoint: `a9245b0564658985b0ad55e98e16557606638606`
- Catalog source: `packages/core/icons/icons.json`
- Families: **250**
- Outline: **250**
- Filled: **250**
- Glyph records: **500**
- Invariant: `500 = 250 × 2` — PASS
- Remaining against target: `250 - 250 = 0 families`; `500 - 500 = 0 glyphs`.

Counts were derived from the actual catalog records, not from a commit title. The 197-family catalog at the parent commit is the older baseline; the 53 names below are the exact canonical family names present in the commit diff.

## Batch 1 families added

| Category | Families |
|---|---|
| Navigation (7) | `chevrons-left`, `chevrons-right`, `arrow-right-left`, `car`, `plane`, `ticket`, `luggage` |
| Action (5) | `sliders-horizontal`, `quote`, `scissors`, `strikethrough`, `target` |
| File (3) | `file-search`, `file-lock`, `book-open` |
| System (17) | `layers`, `git-branch`, `git-merge`, `git-pull-request`, `git-commit`, `braces`, `hash`, `monitor`, `smartphone`, `battery`, `battery-charging`, `power`, `sun`, `moon`, `fingerprint`, `presentation`, `kanban` |
| Communication (5) | `phone-call`, `phone-off`, `headphones`, `mail-open`, `megaphone` |
| Commerce (7) | `shopping-cart`, `shopping-bag`, `credit-card`, `wallet`, `receipt`, `briefcase`, `truck` |
| Media (6) | `music`, `film`, `record`, `repeat`, `shuffle`, `captions` |
| Status (3) | `shield-alert`, `ban`, `badge-check` |
| **Total (53)** | **106 glyphs** |

Each family has one `outline` and one `filled` record. The scissors refinements approved during Batch 1 are included in this checkpoint; no older family was redrawn.

## Final category distribution

| Category | Existing baseline | Batch 1 | Total |
|---|---:|---:|---:|
| Navigation | 40 | 7 | 47 |
| Action | 61 | 5 | 66 |
| File | 31 | 3 | 34 |
| System | 41 | 17 | 58 |
| Communication | 18 | 5 | 23 |
| Status | 6 | 3 | 9 |
| Commerce | 0 | 7 | 7 |
| Media | 0 | 6 | 6 |
| **Total** | **197** | **53** | **250** |

## Aliases and search metadata

`icons.json` has no explicit `aliases` property: it contains canonical names plus `tags`. At this checkpoint there are 1,538 tag occurrences (412 unique case-folded tag strings across both variants), and the showcase has 64 family keys with Spanish search synonyms. Tags/synonyms are search metadata, not extra exported icon families. Batch 1's family-specific English tags are recorded in the canonical catalog and the original proposal; its Spanish terms are in `apps/showcase/src/app/showcase-data.ts`.

## Geometry freeze

Compared every pre-existing record and its generated SVG and TypeScript definition at `HEAD^` against the Batch 1 commit. All 394 old records match exactly; all 394 old SVG files and all 394 old generated definition files are byte-identical. No mismatch was found.

## Stash

`stash@{0}` is still `e36c545e59247efa964833e5d1d8a77fcc0bb93a`. With untracked entries included, its sole path is `NEURAL-UI-REQUIRED-ICON-SET.md`; SHA-256 is `fd93e05af8dc05928e0b03175663f8fab5114713279e18e315c582215a3390a1`. It was not applied, popped, or dropped.
