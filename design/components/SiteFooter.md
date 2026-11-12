# SiteFooter

`src/components/SiteFooter.astro` · changed in v3

![SiteFooter](../mocks/2026-11-12-v3/components/SiteFooter.jpg)

## What it is

Site footer (DESIGN v3 §e, D-06): display-type name, role line, a links row
with 44px targets, then a hair rule and a meta row with the nav and the
labelled llms.txt link. No top rule: the CTA slab (or the page's last
section rule) closes the page above it.

## Props

None.

## Used on

- `via Base`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
