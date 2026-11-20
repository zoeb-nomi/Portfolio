// A value written "a → b" is set with the red arrow (.ar2) between its halves.
// Input is our own copy.ts text, escaped here anyway.
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const arrowHtml = (v: string): string => esc(v).replace(/→/g, '<span class="ar2">→</span>');
