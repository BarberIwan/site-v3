// Eén bron voor alle feiten op de site: adres, tijden, prijzen, reviews, foto's.
// Pagina's, structured data, sitemap en llms.txt lezen allemaal hieruit, zodat
// een prijs of openingstijd maar op één plek hoeft te veranderen.

export const SITE_URL = 'https://barberiwan.nl';

// Datum waarop de inhoud hieronder voor het laatst is nagekeken (sitemap lastmod).
export const CONTENT_DATE = '2026-10-26';
export const CONTENT_YEAR = 2026;

export const business = {
  name: 'Barber Iwan',
  owner: 'Iwan',
  since: 1994,
  phone: {
    display: '06 — 27 40 36 07',
    plain: '06-27403607',
    e164: '+31627403607',
    href: 'tel:+31627403607',
    whatsapp: 'https://wa.me/31627403607',
  },
  address: {
    street: 'Michelangelostraat 195',
    postalCode: '1328 VX',
    city: 'Almere',
    district: 'Tussen de Vaarten',
    region: 'Flevoland',
    country: 'NL',
  },
  // Plaats van de pin in Google Maps (niet het midden van de kaart).
  geo: { lat: 52.3687526, lng: 5.2738634 },
  maps: {
    place: 'https://www.google.com/maps?cid=13544014523377887645',
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=Barber%20Iwan%2C%20Michelangelostraat%20195%2C%201328%20VX%20Almere',
    embed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.7754266536!2d5.2693787765566!3d52.3687557720329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c6163463665555%3A0xbbf6017322aba99d!2sBarber%20Iwan!5e0!3m2!1snl!2snl!4v1704067200000!5m2!1snl!2snl',
  },
  booking: 'https://barber-iwan-1.salonized.com/widget_bookings/new',
  instagram: { url: 'https://www.instagram.com/barberiwan/', handle: '@barberiwan' },
  facebook: 'https://www.facebook.com/barberiwan/',
  treatwell: 'https://www.treatwell.nl/salon/barber-iwan/',
} as const;

export const hairTypes = ['Europees', 'Aziatisch', 'Black', 'Mixed'] as const;

export interface OpeningDay {
  day: string;
  schemaDay: string;
  opens?: string;
  closes?: string;
}

// Maandag eerst, zoals een Nederlandse lezer het verwacht.
export const openingHours: OpeningDay[] = [
  { day: 'Maandag', schemaDay: 'Monday' },
  { day: 'Dinsdag', schemaDay: 'Tuesday', opens: '09:00', closes: '17:00' },
  { day: 'Woensdag', schemaDay: 'Wednesday', opens: '09:00', closes: '17:00' },
  { day: 'Donderdag', schemaDay: 'Thursday', opens: '09:00', closes: '17:00' },
  { day: 'Vrijdag', schemaDay: 'Friday', opens: '09:00', closes: '17:00' },
  { day: 'Zaterdag', schemaDay: 'Saturday', opens: '09:00', closes: '17:00' },
  { day: 'Zondag', schemaDay: 'Sunday' },
];

export const openingSummary = 'Dinsdag t/m zaterdag 09:00 – 17:00';

// JavaScript telt zondag als 0; de lijst hierboven begint op maandag.
export function openingForJsDay(jsDay: number): OpeningDay {
  return openingHours[(jsDay + 6) % 7];
}

export type ServiceGroup = 'heren' | 'kinderen' | 'late-night';

export interface Service {
  id: string;
  name: string;
  description: string;
  minutes: number;
  price: number;
  group: ServiceGroup;
}

// Overgenomen uit de online agenda (Salonized), zelfde als Treatwell.
export const PRICES_CHECKED = 'oktober 2026';

export const services: Service[] = [
  {
    id: 'knippen',
    name: 'Knippen of fade',
    description: 'Kapsel strak, lijnen scherp — klassiek of met fade.',
    minutes: 30,
    price: 32,
    group: 'heren',
  },
  {
    id: 'knippen-baard',
    name: 'Knippen + baard',
    description: 'De complete look: kapsel en baard in één afspraak.',
    minutes: 30,
    price: 40,
    group: 'heren',
  },
  {
    id: 'baard',
    name: 'Baard',
    description: 'Trimmen, shapen en strakke contouren voor een verzorgde baard.',
    minutes: 15,
    price: 20,
    group: 'heren',
  },
  {
    id: 'kids-5-12',
    name: 'Kinderen 5 – 12 jaar',
    description: 'Verzorgd jongenskapsel, netjes en passend bij leeftijd en stijl.',
    minutes: 30,
    price: 27,
    group: 'kinderen',
  },
  {
    id: 'kids-1-4',
    name: 'Kinderen 1 – 4 jaar',
    description: 'Eenvoudige, rustige knipbeurt voor de kleintjes.',
    minutes: 30,
    price: 22,
    group: 'kinderen',
  },
  {
    id: 'late-knippen',
    name: 'Knippen — VIP late night',
    description: 'Late afspraak buiten de vaste openingstijden.',
    minutes: 30,
    price: 50,
    group: 'late-night',
  },
  {
    id: 'late-knippen-baard',
    name: 'Knippen + baard — VIP late night',
    description: 'Kapsel en baard als late afspraak buiten de vaste openingstijden.',
    minutes: 45,
    price: 65,
    group: 'late-night',
  },
];

export const serviceGroups: { id: ServiceGroup; title: string; intro: string }[] = [
  { id: 'heren', title: 'Heren', intro: 'Knippen, fades en baard voor elk haartype.' },
  { id: 'kinderen', title: 'Kinderen', intro: 'Rustig en vlot, voor jongens van 1 tot en met 12 jaar.' },
  {
    id: 'late-night',
    title: 'VIP late night',
    intro: 'Niet overdag kunnen? Kijk in de agenda welke late tijden er vrij zijn.',
  },
];

export const servicesIn = (group: ServiceGroup) => services.filter((s) => s.group === group);
export const serviceById = (id: string) => services.find((s) => s.id === id)!;

export const priceRange = `€${Math.min(...services.map((s) => s.price))} – €${Math.max(
  ...services.map((s) => s.price),
)}`;

export const formatPrice = (euro: number) => `€ ${euro}`;

export interface Review {
  name: string;
  text: string;
  topic?: 'kinderen';
}

// Letterlijk overgenomen geverifieerde reviews van Treatwell (oktober 2026).
export const reviewSummary = {
  source: 'Treatwell',
  rating: '5,0',
  count: 43,
  checked: 'oktober 2026',
  url: business.treatwell,
};

export const reviews: Review[] = [
  {
    name: 'Nathaly',
    topic: 'kinderen',
    text: 'Heel vriendelijk en mijn zoontje is super netjes geknipt. Daarbij luisterde Iwan ook heel goed naar mijn wensen en gaf mij ook advies. Mijn zoon van 2 vond het erg spannend maar Iwan wist hem kalm te krijgen. Wij komen zeker terug!',
  },
  {
    name: 'Jeff',
    text: 'Fijne, rustige locatie waar een ongedwongen sfeer hangt en er gezellig een geïnteresseerd praatje wordt gemaakt tijdens het trimmen/ knippen.',
  },
  {
    name: 'Daisy',
    topic: 'kinderen',
    text: 'Vandaag voor het eerst met m’n jongens gekomen en ben zeer tevreden. Hij werkt snel en goed!',
  },
  { name: 'Frans', text: 'Goedgekeurd door het thuispubliek, heerlijke ervaring.' },
  { name: 'Marcel', text: 'Altijd goed bij Iwan' },
  { name: 'Deborah', text: 'One of the best barbers' },
];

export interface Faq {
  q: string;
  a: string;
}

export const faqs: Record<string, Faq> = {
  afspraak: {
    q: 'Kan ik zonder afspraak langskomen?',
    a: 'Ik werk uitsluitend op afspraak. Zo heb ik voor ieder kapsel de tijd en aandacht die het verdient. Online boeken is zo gedaan.',
  },
  vooruit: {
    q: 'Hoe ver van tevoren kan ik online boeken?',
    a: 'Online boeken kan tot 24 uur van tevoren. Wil je eerder terecht, bel of app dan even; dan kijk ik wat er mogelijk is.',
  },
  prijs: {
    q: 'Wat kost een knipbeurt?',
    a: `Knippen of een fade kost €${serviceById('knippen').price}, knippen + baard €${serviceById('knippen-baard').price} en alleen de baard €${serviceById('baard').price}. Kinderen van 1 tot en met 4 jaar knip ik voor €${serviceById('kids-1-4').price}, van 5 tot en met 12 jaar voor €${serviceById('kids-5-12').price}.`,
  },
  duur: {
    q: 'Hoe lang duurt een knipbeurt?',
    a: `In de agenda staat knippen of een fade voor ${serviceById('knippen').minutes} minuten, knippen + baard ook voor ${serviceById('knippen-baard').minutes} minuten en alleen de baard voor ${serviceById('baard').minutes} minuten.`,
  },
  haartypes: {
    q: 'Heb je ervaring met krullend en kroeshaar?',
    a: 'Zeker. Ik werk al ruim dertig jaar met alle haartypes: Europees, Aziatisch, Black en Mixed hair. Elke textuur vraagt een eigen aanpak.',
  },
  baard: {
    q: 'Kan ik ook terecht voor mijn baard?',
    a: 'Ja, ik verzorg ook baarden: van een nette trim tot een volledige scheerbeurt met hot towel. Vraag ernaar bij je afspraak.',
  },
  kinderen: {
    q: 'Knip je ook kinderen?',
    a: `Ja. Voor kinderen van 1 tot en met 4 jaar is er een eenvoudige, rustige knipbeurt (€${serviceById('kids-1-4').price}), voor 5 tot en met 12 jaar een verzorgd jongenskapsel (€${serviceById('kids-5-12').price}).`,
  },
  annuleren: {
    q: 'Wat is je annuleringsbeleid?',
    a: 'Je kunt tot 24 uur van tevoren kosteloos annuleren. Bij no-shows of te late annulering kan een vergoeding in rekening worden gebracht.',
  },
  betalen: {
    q: 'Kan ik pinnen of moet ik contant betalen?',
    a: 'Je kunt pinnen en contant betalen. Tikkie kan ook.',
  },
  parkeren: {
    q: 'Waar kan ik parkeren?',
    a: 'Er is gratis parkeergelegenheid in de buurt van de salon aan de Michelangelostraat.',
  },
  waar: {
    q: 'Waar zit Barber Iwan?',
    a: 'Aan de Michelangelostraat 195, 1328 VX Almere, in de wijk Tussen de Vaarten.',
  },
  blackKapsels: {
    q: 'Welke kapsels knip je bij Black en Mixed hair?',
    a: 'Onder meer fades en tapers (low, mid en high), strakke line-ups en contouren, krullen of afro bovenop in model, baarden en geschoren figuren.',
  },
  figuren: {
    q: 'Kun je ook een figuur in het haar scheren?',
    a: 'Ja, dat kan bij elk haartype. Neem gerust een voorbeeld mee, of laat mij zelf iets ontwerpen.',
  },
  kinderLeeftijd: {
    q: 'Vanaf welke leeftijd knip je kinderen?',
    a: `Vanaf 1 jaar. Voor de kleintjes tot en met 4 jaar is er een eenvoudige, rustige knipbeurt van €${serviceById('kids-1-4').price}; van 5 tot en met 12 jaar een verzorgd jongenskapsel van €${serviceById('kids-5-12').price}.`,
  },
  kinderSamen: {
    q: 'Kunnen broertjes of vader en zoon samen komen?',
    a: 'Zeker. Boek in de agenda voor ieder een eigen afspraak, aansluitend na elkaar.',
  },
};

export interface Photo {
  file: string;
  width: number;
  height: number;
  webp: number[];
  title: string;
  caption: string;
  alt: string;
}

const photo = (
  file: string,
  width: number,
  height: number,
  webp: number[],
  title: string,
  caption: string,
  alt: string,
): Photo => ({ file, width, height, webp, title, caption, alt });

export const photoSrc = (p: Photo) => `/${p.file}`;
export const photoWebp = (p: Photo, w: number) => `/img/${p.file.replace(/\.[a-z]+$/, '')}-${w}.webp`;

export const work: Photo[] = [
  photo('7BA86E7C-5624-4FB8-B92B-ED7F1729ACC7.jpg', 900, 1200, [480, 900], 'Krullen met mid fade', 'Krullend bovenhaar, een mid fade en een volle, strak getrimde baard.', 'Man met krullend bovenhaar, mid fade en volle getrimde baard, van opzij'),
  photo('7367F35C-CC28-43C5-A6F7-E786E6FD6D31.jpg', 900, 1200, [480, 900], 'Contouren bij vlechten', 'Strak bijgewerkte zijkanten en lijnen rond cornrows.', 'Jongeman met cornrows en strak bijgewerkte contouren, van opzij'),
  photo('ECE8A51A-C1C4-4D31-9604-795D3E8BC503.jpg', 900, 1200, [480, 900], 'Klassieke taper', 'Donker, steil haar met een nette taper in de nek.', 'Klassiek herenkapsel met taper in de nek, van achteren'),
  photo('C61F0EF9-D76E-4DD4-AA20-F9F5ADF5E800.jpg', 900, 1200, [480, 900], 'Buzzcut met fade', 'Kort geknipt, met een strakke overgang en contour rond het oor.', 'Korte buzzcut met fade en strakke contour rond het oor'),
  photo('CF0D0669-07E7-485C-8260-C9BED93B82F8.jpg', 900, 1200, [480, 900], 'Korte crop met fade', 'Kort, getextureerd bovenhaar met een fade.', 'Korte crop met fade bij een jongeman, van opzij'),
  photo('2D8D9132-0A24-4FA7-B8A7-3D3A91395F3F.jpg', 1024, 1536, [480, 1024], 'Lange pony met low taper', 'Steil haar met een lange pony en een lage taper.', 'Steil donker haar met lange pony en low taper, van opzij'),
  photo('9AA8A269-A960-4E8A-B7B7-22A7C1038927.jpg', 900, 1200, [480, 900], 'Kaal met baard', 'Glad hoofd en een verzorgde, grijze baard.', 'Kaal geschoren hoofd met verzorgde grijze baard'),
];

export const instagram: Photo[] = [
  photo('ig-3.jpg', 900, 1200, [400, 900], 'Afro top met taper', 'Krullend haar bovenop, taper fade en baard.', 'Krullend afrohaar bovenop met taper fade en baard'),
  photo('ig-2.jpg', 900, 1200, [400, 900], 'Textured top met fade', 'Getextureerd bovenhaar met een fade.', 'Jongen met getextureerd bovenhaar en fade'),
  photo('ig-4.jpg', 900, 1200, [400, 900], 'Lang haar met fade', 'Lang, naar achteren gekamd haar met fade opzij en een strakke baard.', 'Lang naar achteren gekamd haar met fade opzij en strakke baard'),
  photo('ig-5.jpg', 900, 1200, [400, 900], 'Kort opzij, volle baard', 'Kort aan de zijkant, langer bovenop, met een volle baard.', 'Kort opzij en langer bovenop, met volle baard'),
  photo('ig-6.jpg', 1026, 1200, [400, 1026], 'Golvend met low taper', 'Golvend bovenhaar met een low taper fade.', 'Golvend bovenhaar met low taper fade'),
  photo('ig-1.jpg', 900, 1200, [400, 900], 'Recht afgeknipt', 'Kort, recht afgeknipt kapsel.', 'Kort, recht afgeknipt kapsel, van achteren'),
];

export const extra = {
  kid: photo('carousel-1.jpg', 488, 448, [488], 'Kinderkapsel met fade', 'Kort kinderkapsel met een fade.', 'Jongen met kort kapsel en fade, van opzij'),
  design: photo('carousel-2.jpg', 488, 448, [488], 'Figuur geschoren', 'Kort, natuurlijk krullend haar met een geschoren figuur.', 'Kort natuurlijk krullend haar met een geschoren figuur aan de zijkant'),
  afro: photo('carousel-3.jpg', 488, 448, [488], 'Afro met taper fade', 'Volumineus krullend haar met een taper fade.', 'Volumineus krullend haar met taper fade en baard'),
  hero: photo('hero-barber.jpg', 864, 1184, [600, 864], '', '', ''),
  tools: photo('tools-flatlay.jpg', 1344, 768, [720, 1344], 'Gereedschap', '', 'Barbergereedschap: kam, scheermes, gouden schaar en een flesje op een donkere ondergrond'),
};

export const allWork: Photo[] = [...work, ...instagram, extra.afro, extra.design, extra.kid];
