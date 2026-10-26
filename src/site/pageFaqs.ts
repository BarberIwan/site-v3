import { faqs, type Faq } from './data';
import type { PageId } from './pages';

// Welke vragen op welke pagina staan. Elke vraag staat op één pagina, zodat de
// FAQ-markup nergens dubbel voorkomt; de pagina toont precies deze lijst.
const byPage: Partial<Record<PageId, (keyof typeof faqs)[]>> = {
  home: ['afspraak', 'vooruit', 'prijs', 'haartypes', 'baard', 'kinderen'],
  prijzen: ['duur', 'betalen', 'annuleren'],
  'black-hair': ['blackKapsels', 'figuren'],
  kinderen: ['kinderLeeftijd', 'kinderSamen'],
  contact: ['waar', 'parkeren'],
};

export function faqsFor(id: PageId): Faq[] {
  return (byPage[id] ?? []).map((key) => faqs[key]);
}
