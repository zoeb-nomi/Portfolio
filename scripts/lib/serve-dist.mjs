// A minimal static server for dist/, so the gates run without `astro preview`.
// Serves /path/ -> dist/path/index.html, unknown paths -> dist/404.html (status 404).
// It does not apply public/_redirects (Cloudflare does that); the old-URL stub
// pages answer those paths locally.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
  '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.vtt': 'text/vtt', '.pdf': 'application/pdf',
};

export async function serveDist(root, port = 0) {
  const dist = path.join(root, 'dist');
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    let p = decodeURIComponent(url.pathname);
    let file = path.join(dist, p);
    if (!file.startsWith(dist)) { res.writeHead(403).end(); return; }
    try {
      const st = await stat(file);
      if (st.isDirectory()) file = path.join(file, 'index.html');
    } catch {}
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' }).end(body);
    } catch {
      const body = await readFile(path.join(dist, '404.html')).catch(() => 'not found');
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }).end(body);
    }
  });
  await new Promise((r) => server.listen(port, '127.0.0.1', r));
  return { server, origin: `http://127.0.0.1:${server.address().port}` };
}
