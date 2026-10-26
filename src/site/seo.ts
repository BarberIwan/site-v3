// Head-tags en structured data per pagina. Draait alleen tijdens het
// vooraf renderen (scripts/prerender.mjs); de browser krijgt kant-en-klare HTML.
//
// Regel: alles wat hier in schema.org staat, staat ook zichtbaar op de pagina.
// Geen aggregateRating (Google staat eigen of overgenomen reviews voor een
// LocalBusiness niet toe), geen prijzen of vragen die de bezoeker niet ziet.

import {
  CONTENT_DATE,
  SITE_URL,
  allWork,
  business,
  extra,
  hairTypes,
  openingHours,
  photoSrc,
  photoWebp,
  priceRange,
  serviceById,
  services,
  type Faq,
  type Service,
} from './data';
import { pages, type PageMeta } from './pages';
import { faqsFor } from './pageFaqs';

type Json = Record<string, unknown>;

const abs = (path: string) => `${SITE_URL}${path}`;
const OG_IMAGE = abs('/og-barber-iwan.jpg');

const ids = {
  salon: abs('/#salon'),
  iwan: abs('/#iwan'),
  website: abs('/#website'),
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Een </script> in de JSON mag de tag niet kunnen sluiten.
const jsonForScript = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

function offer(s: Service): Json {
  return {
    '@type': 'Offer',
    name: s.name,
    price: s.price.toFixed(2),
    priceCurrency: 'EUR',
    itemOffered: {
      '@type': 'Service',
      name: s.name,
      description: s.description,
      provider: { '@id': ids.salon },
    },
  };
}

function salon(withCatalog: boolean): Json {
  const node: Json = {
    '@type': 'HairSalon',
    '@id': ids.salon,
    name: business.name,
    description: `Herenkapper en barber in Almere met ruim dertig jaar ervaring in ${hairTypes
      .slice(0, -1)
      .join(', ')} en ${hairTypes.at(-1)} hair. Knippen, fades, baard en kinderkapsels, op afspraak.`,
    url: abs('/'),
    telephone: business.phone.e164,
    image: [OG_IMAGE, ...allWork.slice(0, 4).map((p) => abs(photoSrc(p)))],
    logo: abs('/icon-512.png'),
    priceRange,
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Contant, pin, Tikkie',
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      postalCode: business.address.postalCode,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      addressCountry: business.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: business.geo.lat, longitude: business.geo.lng },
    hasMap: business.maps.place,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: openingHours.filter((d) => d.opens).map((d) => d.schemaDay),
        opens: '09:00',
        closes: '17:00',
      },
    ],
    areaServed: { '@type': 'City', name: 'Almere' },
    founder: { '@id': ids.iwan },
    sameAs: [business.instagram.url, business.facebook, business.treatwell],
    knowsAbout: ['Fades', 'Tapers', 'Black hair', 'Mixed hair', 'Krullend haar', 'Baardverzorging', 'Kinderkapsels'],
  };
  if (withCatalog) {
    node.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Behandelingen en prijzen',
      itemListElement: services.map(offer),
    };
  }
  return node;
}

const iwan: Json = {
  '@type': 'Person',
  '@id': ids.iwan,
  name: business.owner,
  jobTitle: 'Barber',
  worksFor: { '@id': ids.salon },
  knowsAbout: ['Europees haar', 'Aziatisch haar', 'Black hair', 'Mixed hair', 'Fades', 'Geschoren figuren'],
};

const website: Json = {
  '@type': 'WebSite',
  '@id': ids.website,
  url: abs('/'),
  name: business.name,
  inLanguage: 'nl-NL',
  publisher: { '@id': ids.salon },
};

const pageTypes: Partial<Record<PageMeta['id'], string>> = {
  haircuts: 'CollectionPage',
  contact: 'ContactPage',
};

function webpage(page: PageMeta): Json {
  const url = abs(page.path);
  return {
    '@type': pageTypes[page.id] ?? 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    inLanguage: 'nl-NL',
    isPartOf: { '@id': ids.website },
    about: { '@id': ids.salon },
    dateModified: CONTENT_DATE,
    primaryImageOfPage: { '@type': 'ImageObject', url: OG_IMAGE, width: 1200, height: 630 },
    ...(page.id === 'home' ? {} : { breadcrumb: { '@id': `${url}#breadcrumb` } }),
  };
}

function breadcrumb(page: PageMeta): Json {
  const url = abs(page.path);
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: pages.home.label, item: abs('/') },
      { '@type': 'ListItem', position: 2, name: page.label, item: url },
    ],
  };
}

function faqPage(page: PageMeta, list: Faq[]): Json {
  return {
    '@type': 'FAQPage',
    '@id': `${abs(page.path)}#vragen`,
    isPartOf: { '@id': `${abs(page.path)}#webpage` },
    mainEntity: list.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

function service(page: PageMeta, name: string, serviceType: string, offered: Service[]): Json {
  return {
    '@type': 'Service',
    '@id': `${abs(page.path)}#dienst`,
    name,
    serviceType,
    provider: { '@id': ids.salon },
    areaServed: { '@type': 'City', name: 'Almere' },
    url: abs(page.path),
    offers: offered.map((s) => ({ '@type': 'Offer', name: s.name, price: s.price.toFixed(2), priceCurrency: 'EUR' })),
  };
}

function gallery(page: PageMeta): Json {
  return {
    '@type': 'ImageGallery',
    '@id': `${abs(page.path)}#galerij`,
    name: 'Haircuts van Barber Iwan',
    isPartOf: { '@id': `${abs(page.path)}#webpage` },
    associatedMedia: allWork.map((p) => ({
      '@type': 'ImageObject',
      contentUrl: abs(photoSrc(p)),
      thumbnailUrl: abs(photoWebp(p, p.webp[0])),
      name: p.title,
      caption: p.caption,
      width: p.width,
      height: p.height,
      creator: { '@id': ids.iwan },
      copyrightHolder: { '@id': ids.salon },
    })),
  };
}

export function structuredData(page: PageMeta): Json {
  const graph: Json[] = [salon(page.id === 'prijzen'), iwan, website, webpage(page)];
  if (page.id !== 'home') graph.push(breadcrumb(page));
  const list = faqsFor(page.id);
  if (list.length) graph.push(faqPage(page, list));
  if (page.id === 'kinderen') {
    graph.push(service(page, 'Kinderkapper', 'Kinderen knippen', [serviceById('kids-1-4'), serviceById('kids-5-12')]));
  }
  if (page.id === 'black-hair') {
    graph.push(
      service(page, 'Knippen voor Black, Mixed en krullend haar', 'Herenkapper', [
        serviceById('knippen'),
        serviceById('knippen-baard'),
        serviceById('baard'),
      ]),
    );
  }
  if (page.id === 'haircuts') graph.push(gallery(page));
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function headTags(page: PageMeta): string {
  const url = abs(page.path);
  const tags = [
    `<title>${escapeHtml(page.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
  ];
  if (page.noindex) {
    tags.push('<meta name="robots" content="noindex, follow" />');
  } else {
    tags.push(
      '<meta name="robots" content="index, follow, max-image-preview:large" />',
      `<link rel="canonical" href="${url}" />`,
    );
  }
  tags.push(
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="nl_NL" />',
    `<meta property="og:site_name" content="${business.name}" />`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta property="og:image:alt" content="Barber Iwan, herenkapper en barber in Almere" />',
    '<meta name="twitter:card" content="summary_large_image" />',
  );
  // Het logo bovenaan is op mobiel het grootste element bij het laden (LCP).
  tags.push(
    '<link rel="preload" as="image" type="image/webp" fetchpriority="high" imagesrcset="/img/logo-336.webp 336w, /img/logo-672.webp 672w" imagesizes="336px" />',
  );
  if (page.id === 'home') {
    const hero = extra.hero;
    tags.push(
      `<link rel="preload" as="image" type="image/webp" imagesrcset="${hero.webp
        .map((w) => `${photoWebp(hero, w)} ${w}w`)
        .join(', ')}" imagesizes="100vw" />`,
    );
  }
  if (!page.noindex) {
    tags.push(`<script type="application/ld+json">${jsonForScript(structuredData(page))}</script>`);
  }
  return tags.join('\n    ');
}

export function adminHeadTags(): string {
  return ['<title>Beheer | Barber Iwan</title>', '<meta name="robots" content="noindex, nofollow" />'].join('\n    ');
}
