// De pagina's van de site met hun zoekmachinegegevens.
// Paden eindigen op een slash: zo serveert nginx de map (dir/index.html) zonder
// extra omleiding, en sturen oude links zonder slash met een 301 hierheen.
//
// Zoekwoorden volgen Google Trends (NL, 2025-2026): "kapper almere" heeft ruim
// drie keer zoveel zoekinteresse als "barber almere", en "kapper almere stad" is
// de grootste verwante zoekterm. Tussen de Vaarten ligt in Almere Stad.

export type PageId =
  | 'home'
  | 'prijzen'
  | 'haircuts'
  | 'fade'
  | 'black-hair'
  | 'baard'
  | 'kinderen'
  | 'over'
  | 'contact'
  | 'voorwaarden'
  | 'niet-gevonden';

export interface PageMeta {
  id: PageId;
  path: string;
  // Korte naam voor menu en kruimelpad.
  label: string;
  title: string;
  description: string;
  sitemap: boolean;
  priority: number;
  noindex?: boolean;
}

export const pages: Record<PageId, PageMeta> = {
  home: {
    id: 'home',
    path: '/',
    label: 'Home',
    title: 'Kapper & barber in Almere Stad | Barber Iwan',
    description:
      'Kapper en barber in Almere Stad (Tussen de Vaarten). Ruim 30 jaar ervaring met Europees, Aziatisch, Black en Mixed hair. Fades, baard en kinderen. Online boeken.',
    sitemap: true,
    priority: 1,
  },
  prijzen: {
    id: 'prijzen',
    path: '/behandelingen-en-prijzen/',
    label: 'Prijzen',
    title: 'Prijzen kapper Almere: knippen €32, baard €20 | Barber Iwan',
    description:
      'Knippen of fade €32, knippen + baard €40, baard €20, kinderen vanaf €22. Alle behandelingen en prijzen van Barber Iwan in Almere Stad. Direct online boeken.',
    sitemap: true,
    priority: 0.9,
  },
  haircuts: {
    id: 'haircuts',
    path: '/haircuts/',
    label: 'Haircuts',
    title: 'Haircuts & fades uit Almere Stad | Portfolio Barber Iwan',
    description:
      'Fades, tapers, krullen, baarden, lijnen en kinderkapsels uit de stoel van Barber Iwan in Almere Stad. Echt werk, gefilterd op stijl.',
    sitemap: true,
    priority: 0.7,
  },
  fade: {
    id: 'fade',
    path: '/fade-kapper-almere/',
    label: 'Fades',
    title: 'Fade kapper in Almere | Skin, low & taper fade | Barber Iwan',
    description:
      'Strakke fades in Almere Stad: low, mid, high, skin fade en taper, voor elk haartype. Knippen of fade €32 bij Barber Iwan, ruim 30 jaar ervaring. Online boeken.',
    sitemap: true,
    priority: 0.8,
  },
  'black-hair': {
    id: 'black-hair',
    path: '/black-hair-kapper-almere/',
    label: 'Black & Mixed hair',
    title: 'Black & Mixed hair kapper in Almere | Barber Iwan',
    description:
      'Afro-, kroes- of krullend haar? Barber Iwan knipt al ruim 30 jaar Black en Mixed hair: fades, tapers, strakke lijnen en geschoren figuren. In Almere Stad, op afspraak.',
    sitemap: true,
    priority: 0.8,
  },
  baard: {
    id: 'baard',
    path: '/baard-trimmen-almere/',
    label: 'Baard',
    title: 'Baard trimmen in Almere | Baard vanaf €20 | Barber Iwan',
    description:
      'Baard trimmen, shapen en strakke contouren in Almere Stad: baard €20, knippen + baard €40. Barber Iwan, op afspraak en direct online te boeken.',
    sitemap: true,
    priority: 0.8,
  },
  kinderen: {
    id: 'kinderen',
    path: '/kinderkapper-almere/',
    label: 'Kinderen',
    title: 'Kinderkapper in Almere Stad vanaf €22 | Barber Iwan',
    description:
      'Rustige knipbeurt voor kinderen van 1 tot en met 4 jaar (€22) en een verzorgd jongenskapsel voor 5 tot en met 12 jaar (€27). Barber Iwan, Almere Stad.',
    sitemap: true,
    priority: 0.8,
  },
  over: {
    id: 'over',
    path: '/over-iwan/',
    label: 'Over Iwan',
    title: 'Over Iwan: barber sinds 1994 in Almere | Barber Iwan',
    description:
      'Het verhaal achter Barber Iwan: sinds 1994 aan de schaar, sinds 2004 als "Barber Iwan" in Almere, en nu een eigen salon in Tussen de Vaarten. Gespecialiseerd in alle haartypes.',
    sitemap: true,
    priority: 0.6,
  },
  contact: {
    id: 'contact',
    path: '/contact/',
    label: 'Contact',
    title: 'Contact & route | Kapper Barber Iwan, Almere Stad',
    description:
      'Barber Iwan, Michelangelostraat 195, 1328 VX Almere (Tussen de Vaarten, Almere Stad). Dinsdag t/m zaterdag 09:00–17:00. Bel 06-27403607 of boek online.',
    sitemap: true,
    priority: 0.8,
  },
  voorwaarden: {
    id: 'voorwaarden',
    path: '/algemene-voorwaarden/',
    label: 'Algemene voorwaarden',
    title: 'Algemene voorwaarden | Barber Iwan',
    description:
      'De algemene voorwaarden van Barber Iwan, kapper in Almere: afspraken, annuleren, betalen en klachten.',
    sitemap: true,
    priority: 0.2,
  },
  'niet-gevonden': {
    id: 'niet-gevonden',
    path: '/404.html',
    label: 'Niet gevonden',
    title: 'Pagina niet gevonden | Barber Iwan',
    description: 'Deze pagina bestaat niet (meer). Ga naar de homepage van Barber Iwan, kapper in Almere Stad.',
    sitemap: false,
    priority: 0,
    noindex: true,
  },
};

// Hoofdmenu; de specialisaties hangen onder één knop.
export const menu: PageId[] = ['prijzen', 'haircuts', 'over', 'contact'];
export const specialties: PageId[] = ['fade', 'black-hair', 'baard', 'kinderen'];

// Adressen van de vorige sites (HashRouter, de Engelse hreflang, Nuxt) die
// nergens meer bestaan. nginx stuurt ze met een 301 door; dit is het vangnet
// in de browser zolang de server dat nog niet doet.
export const legacyRedirects: Record<string, string> = {
  '/terms/': pages.voorwaarden.path,
  '/en/': pages.home.path,
  '/privacy-verklaring/': pages.home.path,
  '/disclaimer/': pages.home.path,
  '/index.html/': pages.home.path,
};

export function normalizePath(pathname: string): string {
  const lower = pathname.toLowerCase();
  return lower.endsWith('/') ? lower : `${lower}/`;
}

export function pageForPath(pathname: string): PageMeta | undefined {
  const path = normalizePath(pathname);
  return Object.values(pages).find((p) => p.sitemap && p.path === path);
}

export function legacyTarget(pathname: string, hash: string): string | undefined {
  if (hash.startsWith('#/terms')) return pages.voorwaarden.path;
  if (hash.startsWith('#/admin')) return `/admin/${hash}`;
  return legacyRedirects[normalizePath(pathname)];
}
