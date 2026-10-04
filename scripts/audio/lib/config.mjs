import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
export const AUDIO_DIR = path.join(ROOT, 'scripts/audio');
export const CACHE = path.join(ROOT, '.audio-cache');

const read = (f) => JSON.parse(readFileSync(path.join(AUDIO_DIR, f), 'utf8'));

export function loadRegistry() {
  const { defaults, pages } = read('pages.json');
  return pages.map((p) => ({ ...defaults, ...p }));
}

export const loadLexicon = () => read('lexicon.json').words ?? {};

export function pageFor(slug) {
  const all = loadRegistry();
  const p = all.find((x) => x.slug === slug);
  if (!p) throw new Error(`"${slug}" is not in scripts/audio/pages.json (known: ${all.map((x) => x.slug).join(', ')})`);
  return p;
}

export const htmlPathFor = (page) => path.join(ROOT, 'dist', page.path, 'index.html');
export const outPaths = (page) => ({
  mp3: path.join(ROOT, 'public/audio', `${page.slug}.mp3`),
  vtt: path.join(ROOT, 'public/audio', `${page.slug}.vtt`),
  manifest: path.join(ROOT, 'src/data/audio', `${page.slug}.json`),
});
