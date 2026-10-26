import { useEffect, useState, type ReactNode } from 'react';
import { Calendar, Instagram, Facebook, Menu, X, MapPin, Phone, Clock } from 'lucide-react';
import { CONTENT_YEAR, business, openingHours } from './data';
import { menu, pages, type PageId } from './pages';
import { CustomCursor, Logo, MagneticLink } from './ui';
import { useNow } from './useNow';

const BOOK_HREF = '/#afspraak';

function SiteNav({ current }: { current: PageId }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen ? 'bg-[#080808]/95 backdrop-blur-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <nav aria-label="Hoofdmenu" className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <MagneticLink href="/" className="flex items-center gap-3" label="Barber Iwan, naar de homepage">
          <Logo className="h-24 w-auto" alt="Barber Iwan" />
        </MagneticLink>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-10">
          {menu.map((id) => (
            <li key={id}>
              <MagneticLink
                href={pages[id].path}
                current={current === id}
                className={`link-underline text-sm tracking-widest uppercase transition-colors ${
                  current === id ? 'text-gold' : 'text-white/70 hover:text-white'
                }`}
              >
                {pages[id].label}
              </MagneticLink>
            </li>
          ))}
        </ul>

        <MagneticLink
          href={BOOK_HREF}
          className="hidden lg:inline-flex items-center btn-cta animate-cta-pulse text-black font-sans text-xs tracking-widest uppercase px-8 py-5 rounded-sm"
        >
          <Calendar className="w-4 h-4 mr-2 inline" aria-hidden="true" />
          Boek nu
        </MagneticLink>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobiel-menu"
          aria-label={menuOpen ? 'Menu sluiten' : 'Menu openen'}
          data-cursor-hover
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobiel-menu"
        hidden={!menuOpen}
        className="lg:hidden absolute top-full left-0 right-0 bg-[#080808] border-t border-white/10 py-8 px-8"
      >
        <ul className="flex flex-col gap-6">
          {menu.map((id) => (
            <li key={id}>
              <a
                href={pages[id].path}
                aria-current={current === id ? 'page' : undefined}
                className={`block text-left text-lg tracking-widest uppercase ${current === id ? 'text-gold' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {pages[id].label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={BOOK_HREF}
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center btn-cta text-black font-sans text-xs tracking-widest uppercase px-8 py-4 rounded-sm"
            >
              <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
              Afspraak maken
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

function SiteFooter() {
  const year = useNow()?.getFullYear() ?? CONTENT_YEAR;
  const a = business.address;

  return (
    <footer className="border-t border-white/5 bg-[#060606]">
      <div className="max-w-7xl mx-auto px-8 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <a href="/" aria-label="Barber Iwan, naar de homepage">
            <Logo className="h-20 w-auto -ml-2" alt="Barber Iwan" />
          </a>
          <p className="text-white/50 text-sm leading-relaxed mt-4 max-w-xs">
            Herenkapper en barber in Almere. Ruim dertig jaar ervaring met Europees, Aziatisch, Black en Mixed hair.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <a
              href={business.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Barber Iwan op Instagram"
              className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all"
            >
              <Instagram className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href={business.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Barber Iwan op Facebook"
              className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all"
            >
              <Facebook className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-gold mb-5 font-sans">Contact</p>
          <address className="not-italic text-sm text-white/70 space-y-3">
            <p className="flex gap-3">
              <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" aria-hidden="true" />
              <a href={business.maps.place} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                {a.street}
                <br />
                {a.postalCode} {a.city}
              </a>
            </p>
            <p className="flex gap-3">
              <Phone className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" aria-hidden="true" />
              <a href={business.phone.href} className="hover:text-gold transition-colors">
                {business.phone.plain}
              </a>
            </p>
          </address>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-gold mb-5 font-sans flex items-center gap-2">
            <Clock className="w-4 h-4" aria-hidden="true" />
            Openingstijden
          </p>
          <dl className="text-sm grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5">
            {openingHours.map((d) => (
              <div key={d.day} className="contents">
                <dt className="text-white/50">{d.day}</dt>
                <dd className={d.opens ? 'text-white/80' : 'text-white/30 italic'}>
                  {d.opens ? `${d.opens} – ${d.closes}` : 'Gesloten'}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-gold mb-5 font-sans">Snel naar</p>
          <ul className="text-sm space-y-2.5">
            {(['prijzen', 'haircuts', 'black-hair', 'kinderen', 'contact'] as PageId[]).map((id) => (
              <li key={id}>
                <a href={pages[id].path} className="text-white/60 hover:text-gold transition-colors">
                  {pages[id].label}
                </a>
              </li>
            ))}
            <li>
              <a href={BOOK_HREF} className="text-gold hover:text-white transition-colors">
                Afspraak maken
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs tracking-wider font-sans">
            © {year} {business.name} — Alle rechten voorbehouden
          </p>
          <a
            href={pages.voorwaarden.path}
            className="text-white/30 text-xs tracking-wider hover:text-gold transition-colors font-sans"
          >
            Algemene voorwaarden
          </a>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ current, children }: { current: PageId; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080808] text-white grain">
      <a href="#inhoud" className="skip-link">
        Ga naar de inhoud
      </a>
      <CustomCursor />
      <SiteNav current={current} />
      <main id="inhoud">{children}</main>
      <SiteFooter />
    </div>
  );
}
