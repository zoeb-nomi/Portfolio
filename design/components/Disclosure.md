# Disclosure

`src/components/Disclosure.astro` · new in v4

## What it is

Depth one tap away. A native `<details>` whose summary is a red-ink text link with a + / − mark. Method,
caveats, tag legends and full tables that a page keeps but does not lead with go inside it. The content stays
in the HTML, opens without script, and `npm run budget` does not count it while closed.

## Props

```ts
  label: string;   // what opens, in a few words
  open?: boolean;
  class?: string;
```

## Used on

- `/builds/` (tag legend, Fig. 2 note, Table 1, Table 2)

## Rules

- Use it instead of a caption that explains a section. A caption that a reader needs to read first is a sign
  the section heading is not doing its job.
- The label says what opens, not "More" or "Details".
- Never hide the one number a section exists to show.
