import test from 'node:test';
import assert from 'node:assert/strict';
import { stamp, toVtt } from '../lib/vtt.mjs';
import { id3v23 } from '../lib/id3.mjs';
import { sha, hashSegments } from '../lib/hash.mjs';

test('vtt timestamps', () => {
  assert.equal(stamp(0), '00:00:00.000');
  assert.equal(stamp(3661.5), '01:01:01.500');
  assert.equal(stamp(59.9996), '00:01:00.000');
});

test('vtt document', () => {
  const v = toVtt([{ start: 0.15, end: 2, text: 'A & B <c>' }], { title: 'T' });
  assert.ok(v.startsWith('WEBVTT\n'));
  assert.ok(v.includes('1\n00:00:00.150 --> 00:00:02.000\nA &amp; B &lt;c&gt;'));
});

test('id3v2.3 header and frames', () => {
  const t = id3v23({ title: 'Résumé test', artist: 'Zoeb Nomi', album: 'zoebnomi.com/writing', encoder: 'x' });
  assert.equal(t.subarray(0, 3).toString('ascii'), 'ID3');
  assert.equal(t[3], 3);
  const size = (t[6] << 21) | (t[7] << 14) | (t[8] << 7) | t[9];
  assert.equal(size, t.length - 10);
  assert.ok(t.includes(Buffer.from('TIT2')) && t.includes(Buffer.from('TPE1')) && t.includes(Buffer.from('TALB')));
  assert.ok(t.includes(Buffer.from('Résumé test', 'utf16le')));
});

test('hashSegments: stable, and sensitive to a one-word change', () => {
  const a = [{ id: 's0-title', raw: 'Hello' }, { id: 's1-p0', raw: 'World' }];
  const b = [{ id: 's0-title', raw: 'Hello' }, { id: 's1-p0', raw: 'Worlds' }];
  assert.equal(hashSegments(a).textHash, hashSegments(a).textHash);
  assert.notEqual(hashSegments(a).textHash, hashSegments(b).textHash);
  assert.equal(hashSegments(a).segmentHashes['s0-title'], hashSegments(b).segmentHashes['s0-title']);
  assert.notEqual(hashSegments(a).segmentHashes['s1-p0'], hashSegments(b).segmentHashes['s1-p0']);
  assert.equal(sha('x').length, 64);
});
