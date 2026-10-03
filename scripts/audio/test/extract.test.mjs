import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { extractSegments, kindOf } from '../lib/extract.mjs';

const page = (body) => {
  const f = path.join(mkdtempSync(path.join(tmpdir(), 'audio-test-')), 'index.html');
  writeFileSync(f, `<!doctype html><html><body><script>document.body.innerHTML='SCRIPT RAN'</script>${body}</body></html>`);
  return f;
};

const good = `
<h1 data-narr="s0-title">The Title</h1>
<p data-narr="s0-dek">The   dek
  text.</p>
<h2 data-narr="s1-cue"><span class="mark">§1</span> <span class="label">First label</span></h2>
<p data-narr="s1-p0">Para <strong>one</strong>.</p>
<div data-narr="s1-quote"><blockquote>A quote.</blockquote></div>`;

test('reads data-narr anchors in order; labels drop the § mark; whitespace collapsed; scripts ignored', async () => {
  const segs = await extractSegments(page(good));
  assert.deepEqual(segs.map((s) => [s.id, s.kind, s.raw]), [
    ['s0-title', 'title', 'The Title'],
    ['s0-dek', 'dek', 'The dek text.'],
    ['s1-cue', 'cue', 'First label'],
    ['s1-p0', 'para', 'Para one.'],
    ['s1-quote', 'quote', 'A quote.'],
  ]);
});

test('a table anchor without a spoken override fails loudly', async () => {
  const f = page(`${good}<div data-narr="s2-table"><table><tr><td>1</td></tr></table></div>`);
  await assert.rejects(extractSegments(f), /s2-table/);
});

test('an override supplies the spoken text and is part of the hash basis', async () => {
  const f = page(`${good}<div data-narr="s2-table"><table><tr><td>1</td></tr></table></div>`);
  const segs = await extractSegments(f, { 's2-table': 'The table shows one.' });
  const t = segs.at(-1);
  assert.equal(t.raw, 'The table shows one.');
  assert.ok(t.hashBasis.includes('The table shows one.') && t.hashBasis.includes('1'));
});

test('overrides for ids that are not on the page are an error (catches typos)', async () => {
  await assert.rejects(extractSegments(page(good), { 's9-nope': 'x' }), /s9-nope/);
});

test('duplicate ids are an error', async () => {
  await assert.rejects(extractSegments(page(`${good}<p data-narr="s1-p0">dup</p>`)), /Duplicate/);
});

test('kindOf', () => {
  assert.deepEqual(['s0-title', 's0-dek', 's3-cue', 's2-quote', 's4-p2', 's2-table'].map(kindOf), ['title', 'dek', 'cue', 'quote', 'para', 'other']);
});
