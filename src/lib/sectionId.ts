// The heading id an essay section gets when it has no explicit anchor (the same slug Section.astro used).
export function sectionId(label: string): string {
  const slug = label
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `sec-${slug}`;
}
