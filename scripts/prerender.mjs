// Na `vite build` en `vite build --ssr`: schrijft voor elke pagina een eigen
// index.html met de volledige inhoud, head-tags en structured data, plus
// 404.html, admin/index.html, sitemap.xml en llms.txt.

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const { render, pages, headTags, adminHeadTags, sitemapXml, llmsTxt } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
);

const template = await readFile(path.join(dist, 'index.html'), 'utf8');
if (!template.includes('<!--app-head-->') || !template.includes('<div id="root"><!--app-html--></div>')) {
  throw new Error('index.html mist de plekken <!--app-head--> en <!--app-html-->');
}

function fill(head, id, body) {
  return template
    .replace('<!--app-head-->', head)
    .replace('<div id="root"><!--app-html--></div>', `<div id="root" data-page="${id}">${body}</div>`);
}

async function write(relative, content) {
  const file = path.join(dist, relative);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
  console.log(`  ${relative}`);
}

for (const page of Object.values(pages)) {
  const html = fill(headTags(page), page.id, render(page.id));
  const target = page.id === 'niet-gevonden' ? '404.html' : path.join(page.path, 'index.html');
  await write(target, html);
}

await write('admin/index.html', fill(adminHeadTags(), 'admin', ''));
await write('sitemap.xml', sitemapXml());
await write('llms.txt', llmsTxt());

await rm(ssrDir, { recursive: true, force: true });
