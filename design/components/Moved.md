# Moved

`src/components/Moved.astro` · new in v3

## What it is

Redirect fallback for an old URL (DESIGN v3 §i). Cloudflare Pages serves the
301 from public/_redirects first; this page exists so the URL still resolves
where _redirects is not applied (local preview, a cached client), and it
carries any incoming #fragment across: /evals/#x lands on /builds/#x when
that id exists on the new page, else on the mapped section.

## Props

```ts
  from: string;
```

## Used on

- `/evals/`
- `/notes/`
- `/shipping/`
- `/work/`
- `via Base`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
