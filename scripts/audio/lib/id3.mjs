// Minimal ID3v2.3 tag (title / artist / album / encoder) to prepend to the mp3,
// matching the tags on the existing narration files. UTF-16 so titles with
// accents (e.g. "résumé") are stored correctly.

function frame(id, text) {
  const body = Buffer.concat([Buffer.from([0x01, 0xff, 0xfe]), Buffer.from(text, 'utf16le')]);
  const head = Buffer.alloc(10);
  head.write(id, 0, 'ascii');
  head.writeUInt32BE(body.length, 4); // v2.3: plain big-endian size
  return Buffer.concat([head, body]);
}

const syncsafe = (n) => Buffer.from([(n >> 21) & 0x7f, (n >> 14) & 0x7f, (n >> 7) & 0x7f, n & 0x7f]);

/** @param {{title:string, artist:string, album:string, encoder?:string}} t */
export function id3v23({ title, artist, album, encoder }) {
  const frames = [frame('TIT2', title), frame('TPE1', artist), frame('TALB', album)];
  if (encoder) frames.push(frame('TSSE', encoder));
  const body = Buffer.concat(frames);
  return Buffer.concat([Buffer.from([0x49, 0x44, 0x33, 0x03, 0x00, 0x00]), syncsafe(body.length), body]);
}
