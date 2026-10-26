// sitemap.xml en llms.txt, gegenereerd uit dezelfde gegevens als de pagina's.

import {
  CONTENT_DATE,
  SITE_URL,
  allWork,
  business,
  extra,
  openingSummary,
  photoSrc,
  reviewSummary,
  serviceGroups,
  servicesIn,
  work,
  type Photo,
} from './data';
import { pages, type PageId } from './pages';

const xmlEscape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const imagesOnPage: Partial<Record<PageId, Photo[]>> = {
  home: work,
  haircuts: allWork,
  'black-hair': [extra.afro, extra.design],
  kinderen: [extra.kid],
};

export function sitemapXml(): string {
  const urls = Object.values(pages)
    .filter((p) => p.sitemap)
    .map((p) => {
      const images = (imagesOnPage[p.id] ?? [])
        .map(
          (img) =>
            `\n    <image:image><image:loc>${SITE_URL}${xmlEscape(photoSrc(img))}</image:loc></image:image>`,
        )
        .join('');
      return `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>${CONTENT_DATE}</lastmod>
    <priority>${p.priority.toFixed(1)}</priority>${images}
  </url>`;
    });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>
`;
}

// Korte, feitelijke samenvatting voor AI-assistenten (https://llmstxt.org).
export function llmsTxt(): string {
  const a = business.address;
  const prices = serviceGroups
    .map(
      (g) =>
        `### ${g.title}\n` +
        servicesIn(g.id)
          .map((s) => `- ${s.name}: €${s.price} (${s.minutes} min) — ${s.description}`)
          .join('\n'),
    )
    .join('\n\n');
  const links = Object.values(pages)
    .filter((p) => p.sitemap)
    .map((p) => `- [${p.label}](${SITE_URL}${p.path}): ${p.description}`)
    .join('\n');
  return `# ${business.name}

> Herenkapper en barber in ${a.city} (${a.district}). Ruim dertig jaar ervaring met Europees, Aziatisch, Black en Mixed hair. Knippen, fades, baard en kinderkapsels. Uitsluitend op afspraak.

## Contact
- Adres: ${a.street}, ${a.postalCode} ${a.city}
- Telefoon en WhatsApp: ${business.phone.plain}
- Openingstijden: ${openingSummary}; maandag en zondag gesloten
- Online afspraak maken: ${business.booking}
- Instagram: ${business.instagram.url}
- Reviews: ${reviewSummary.rating} uit 5 op ${reviewSummary.source} (${reviewSummary.count} reviews, ${reviewSummary.checked}): ${reviewSummary.url}

## Behandelingen en prijzen
${prices}

## Pagina's
${links}
`;
}
