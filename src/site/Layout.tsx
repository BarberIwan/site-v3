import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Calendar, ChevronDown, Facebook, Instagram, Menu, Navigation, Phone, X } from 'lucide-react';
import { CONTENT_YEAR, business, openingHours, reviewSummary } from './data';
import { menu, pages, specialties, type PageId } from './pages';
import { Logo } from './ui';
import { useNow } from './useNow';
import { useReveal } from './useReveal';

const BOOK_HREF = '/#afspraak';

function SpecialtiesMenu({ current }: { current: PageId }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const active = specialties.includes(current);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  return (
    <li ref={ref} className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="menu-specialisaties"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        className={`flex items-center gap-1.5 text-[13px] tracking-[0.18em] uppercase transition-colors ${
          active ? 'text-gold' : 'text-white/70 hover:text-white'
        }`}
      >
        Specialisaties
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <div
        id="menu-specialisaties"
        hidden={!open}
        className="absolute left-1/2 -translate-x-1/2 top-full pt-4"
      >
        <ul className="min-w-56 bg-[#0d0d0c] border border-white/10 py-3 shadow-2xl">
          {specialties.map((id) => (
            <li key={id}>
              <a
                href={pages[id].path}
                aria-current={current === id ? 'page' : undefined}
                className={`block px-6 py-2.5 text-sm transition-colors ${
                  current === id ? 'text-gold' : 'text-white/70 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {pages[id].label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function SiteHeader({ current }: { current: PageId }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`site-header fixed top-0 left-0 right-0 z-50 transition-[background-color,padding,border-color] duration-500 border-b ${
        solid ? 'bg-[#080808]/90 backdrop-blur-md py-3 border-white/[0.06]' : 'bg-transparent py-5 border-transparent'
      }`}
    >
      <nav aria-label="Hoofdmenu" className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between gap-8">
        <a href="/" className="flex-shrink-0" aria-label="Barber Iwan, naar de homepage">
          <Logo className={`w-auto transition-[height] duration-500 ${solid ? 'h-14' : 'h-20'}`} sizes="168px" />
        </a>

        <ul className="hidden xl:flex items-center gap-9 whitespace-nowrap">
          <li>
            <a
              href={pages.prijzen.path}
              aria-current={current === 'prijzen' ? 'page' : undefined}
              className={`text-[13px] tracking-[0.18em] uppercase transition-colors ${
                current === 'prijzen' ? 'text-gold' : 'text-white/70 hover:text-white'
              }`}
            >
              Behandelingen
            </a>
          </li>
          <SpecialtiesMenu current={current} />
          {menu
            .filter((id) => id !== 'prijzen')
            .map((id) => (
              <li key={id}>
                <a
                  href={pages[id].path}
                  aria-current={current === id ? 'page' : undefined}
                  className={`text-[13px] tracking-[0.18em] uppercase transition-colors ${
                    current === id ? 'text-gold' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {pages[id].label}
                </a>
              </li>
            ))}
        </ul>

        <div className="hidden xl:flex items-center gap-6 whitespace-nowrap">
          <a href={business.phone.href} className="hidden 2xl:inline text-[13px] tracking-[0.12em] text-white/60 hover:text-white transition-colors">
            {business.phone.plain}
          </a>
          <a href={BOOK_HREF} className="btn btn-primary !px-6 !py-3">
            Afspraak maken
          </a>
        </div>

        <button
          type="button"
          className="xl:hidden p-2 -mr-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobiel-menu"
          aria-label={menuOpen ? 'Menu sluiten' : 'Menu openen'}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      <div
        id="mobiel-menu"
        hidden={!menuOpen}
        className="xl:hidden absolute top-full left-0 right-0 h-[calc(100svh-100%)] overflow-y-auto bg-[#080808] border-t border-white/10 px-6 py-10"
      >
        <ul className="space-y-1">
          {(['home', 'prijzen', ...specialties, 'haircuts', 'over', 'contact'] as PageId[]).map((id) => (
            <li key={id}>
              <a
                href={pages[id].path}
                aria-current={current === id ? 'page' : undefined}
                className={`block py-3 font-serif text-3xl ${current === id ? 'text-gold italic' : 'text-white/85'}`}
                onClick={() => setMenuOpen(false)}
              >
                {id === 'prijzen' ? 'Behandelingen & prijzen' : pages[id].label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-white/50">
          {business.address.street}, {business.address.city}
          <br />
          {business.phone.plain}
        </p>
      </div>
    </header>
  );
}

// Op mobiel altijd binnen bereik: de drie dingen waarvoor iemand komt.
function MobileActionBar() {
  return (
    <nav aria-label="Snel contact" className="mobile-bar lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#080808]/95 backdrop-blur-md border-t border-white/10">
      <ul className="grid grid-cols-3">
        <li>
          <a href={BOOK_HREF} className="flex flex-col items-center gap-1 py-3 text-gold">
            <Calendar className="w-5 h-5" aria-hidden="true" />
            <span className="text-[10px] tracking-[0.2em] uppercase">Boeken</span>
          </a>
        </li>
        <li>
          <a href={business.phone.href} className="flex flex-col items-center gap-1 py-3 text-white/80 border-x border-white/10">
            <Phone className="w-5 h-5" aria-hidden="true" />
            <span className="text-[10px] tracking-[0.2em] uppercase">Bellen</span>
          </a>
        </li>
        <li>
          <a href={business.maps.directions} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 py-3 text-white/80">
            <Navigation className="w-5 h-5" aria-hidden="true" />
            <span className="text-[10px] tracking-[0.2em] uppercase">Route</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

function SiteFooter() {
  const year = useNow()?.getFullYear() ?? CONTENT_YEAR;
  const a = business.address;

  return (
    <footer className="border-t border-white/[0.06] bg-[#060606]">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 grid gap-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <a href="/" aria-label="Barber Iwan, naar de homepage">
            <Logo className="h-20 w-auto -ml-2" sizes="120px" />
          </a>
          <p className="text-white/50 text-sm leading-relaxed mt-5 max-w-xs">
            Kapper en barber in {a.area}. Sinds {business.since} aan de schaar, voor Europees, Aziatisch, Black en Mixed hair.
          </p>
          <p className="text-white/40 text-xs mt-5">
            ★ {reviewSummary.rating} op {reviewSummary.source} · {reviewSummary.count} reviews
          </p>
          <div className="flex items-center gap-3 mt-6">
            <a href={business.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Barber Iwan op Instagram" className="w-10 h-10 border border-white/15 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
              <Instagram className="w-4 h-4" aria-hidden="true" />
            </a>
            <a href={business.facebook} target="_blank" rel="noopener noreferrer" aria-label="Barber Iwan op Facebook" className="w-10 h-10 border border-white/15 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
              <Facebook className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-6">Salon</p>
          <address className="not-italic text-sm text-white/70 leading-relaxed">
            <a href={business.maps.place} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
              {a.street}
              <br />
              {a.postalCode} {a.city}
            </a>
            <br />
            <span className="text-white/40">
              {a.district}, {a.area}
            </span>
          </address>
          <p className="mt-4 text-sm">
            <a href={business.phone.href} className="text-white/70 hover:text-gold transition-colors">
              {business.phone.plain}
            </a>
          </p>
        </div>

        <div>
          <p className="eyebrow mb-6">Open</p>
          <dl className="text-sm grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5">
            {openingHours.map((d) => (
              <div key={d.day} className="contents">
                <dt className="text-white/45">{d.day.slice(0, 2)}</dt>
                <dd className={d.opens ? 'text-white/75' : 'text-white/30'}>{d.opens ? `${d.opens} – ${d.closes}` : 'Gesloten'}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <p className="eyebrow mb-6">Ontdek</p>
          <ul className="text-sm space-y-2.5">
            {(['prijzen', ...specialties, 'haircuts', 'over', 'contact'] as PageId[]).map((id) => (
              <li key={id}>
                <a href={pages[id].path} className="text-white/60 hover:text-gold transition-colors">
                  {id === 'prijzen' ? 'Behandelingen & prijzen' : pages[id].label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-white/30 text-xs tracking-wider">
          <p>
            © {year} {business.name}
          </p>
          <a href={pages.voorwaarden.path} className="hover:text-gold transition-colors">
            Algemene voorwaarden
          </a>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ current, children }: { current: PageId; children: ReactNode }) {
  useReveal();
  return (
    <div className="min-h-screen bg-[#080808] text-white grain">
      <a href="#inhoud" className="skip-link">
        Ga naar de inhoud
      </a>
      <SiteHeader current={current} />
      <main id="inhoud">{children}</main>
      <SiteFooter />
      <MobileActionBar />
    </div>
  );
}
