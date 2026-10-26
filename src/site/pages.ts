// De pagina's van de site met hun zoekmachinegegevens.
// Paden eindigen op een slash: zo serveert nginx de map (dir/index.html) zonder
// extra omleiding, en sturen oude links zonder slash met een 301 hierheen.

export type PageId =
  | 'home'
  | 'prijzen'
  | 'haircuts'
  | 'black-hair'
  | 'kinderen'
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
    title: 'Barber Iwan | Herenkapper & barber in Almere, alle haartypes',
    description:
      'Barber Iwan in Almere (Tussen de Vaarten): ruim 30 jaar ervaring met Europees, Aziatisch, Black en Mixed hair. Fades, baard en kinderen. Online boeken.',
    sitemap: true,
    priority: 1,
  },
  prijzen: {
    id: 'prijzen',
    path: '/behandelingen-en-prijzen/',
    label: 'Prijzen',
    title: 'Prijzen knippen, fade & baard | Barber Iwan Almere',
    description:
      'Knippen of fade €32, knippen + baard €40, baard €20, kinderen vanaf €22. Alle behandelingen en prijzen van Barber Iwan in Almere. Direct online boeken.',
    sitemap: true,
    priority: 0.9,
  },
  haircuts: {
    id: 'haircuts',
    path: '/haircuts/',
    label: 'Haircuts',
    title: 'Haircuts & fades uit Almere | Portfolio Barber Iwan',
    description:
      'Fades, tapers, krullen, baarden en kinderkapsels uit de stoel van Barber Iwan in Almere. Echt werk uit de salon in Tussen de Vaarten.',
    sitemap: true,
    priority: 0.7,
  },
  'black-hair': {
    id: 'black-hair',
    path: '/black-hair-kapper-almere/',
    label: 'Black & Mixed hair',
    title: 'Kapper voor Black, Mixed & krullend haar in Almere | Barber Iwan',
    description:
      'Afro-, kroes- of krullend haar? Barber Iwan knipt al ruim 30 jaar Black en Mixed hair: fades, tapers, strakke lijnen en geschoren figuren. In Almere, op afspraak.',
    sitemap: true,
    priority: 0.8,
  },
  kinderen: {
    id: 'kinderen',
    path: '/kinderkapper-almere/',
    label: 'Kinderen',
    title: 'Kinderkapper Almere | Kinderen knippen vanaf €22 | Barber Iwan',
    description:
      'Rustige knipbeurt voor kinderen van 1 tot en met 4 jaar (€22) en een verzorgd jongenskapsel voor 5 tot en met 12 jaar (€27). Barber Iwan, Almere.',
    sitemap: true,
    priority: 0.8,
  },
  contact: {
    id: 'contact',
    path: '/contact/',
    label: 'Contact',
    title: 'Contact, route & openingstijden | Barber Iwan Almere',
    description:
      'Barber Iwan, Michelangelostraat 195, 1328 VX Almere (Tussen de Vaarten). Dinsdag t/m zaterdag 09:00–17:00. Bel 06-27403607 of boek online.',
    sitemap: true,
    priority: 0.8,
  },
  voorwaarden: {
    id: 'voorwaarden',
    path: '/algemene-voorwaarden/',
    label: 'Algemene voorwaarden',
    title: 'Algemene voorwaarden | Barber Iwan',
    description:
      'De algemene voorwaarden van Barber Iwan, herenkapper in Almere: afspraken, annuleren, betalen en klachten.',
    sitemap: true,
    priority: 0.2,
  },
  'niet-gevonden': {
    id: 'niet-gevonden',
    path: '/404.html',
    label: 'Niet gevonden',
    title: 'Pagina niet gevonden | Barber Iwan',
    description: 'Deze pagina bestaat niet (meer). Ga naar de homepage van Barber Iwan, herenkapper in Almere.',
    sitemap: false,
    priority: 0,
    noindex: true,
  },
};

export const menu: PageId[] = ['prijzen', 'haircuts', 'black-hair', 'kinderen', 'contact'];

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
