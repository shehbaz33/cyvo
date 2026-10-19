// Inject the server-rendered (static, fully readable) story into dist/index.html so the page
// has real content before JavaScript loads, and still reads correctly without it.
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { render } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href);
const file = resolve(root, 'dist/index.html');
const html = readFileSync(file, 'utf8').replace('<!--app-html-->', render());
writeFileSync(file, html);
rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true });
console.log('prerendered dist/index.html (' + Math.round(html.length / 1024) + ' KB)');
