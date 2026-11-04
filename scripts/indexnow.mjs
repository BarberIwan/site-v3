// Meldt alle pagina's uit dist/sitemap.xml bij IndexNow (Bing, Yandex, Seznam,
// Naver; Bing voedt ook ChatGPT-zoeken en DuckDuckGo). Draaien na een deploy:
//     node scripts/indexnow.mjs
// De sleutel staat als bestand in public/ zodat de zoekmachine hem kan controleren.

import { readFile } from 'node:fs/promises';
import path from 'node:path';

const KEY = 'cd2ae10297b4f7834ea61a92d09df15a';
const HOST = 'barberiwan.nl';

const sitemap = await readFile(path.resolve(import.meta.dirname, '../dist/sitemap.xml'), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${res.status} voor ${urlList.length} adressen`);
