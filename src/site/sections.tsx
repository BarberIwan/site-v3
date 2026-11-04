import type { ReactNode } from 'react';
import { ArrowRight, Calendar, MapPin, MessageCircle, Phone, Star } from 'lucide-react';
import {
  business,
  formatPrice,
  openingForJsDay,
  openingHours,
  openingSummary,
  photos,
  PRICES_CHECKED,
  reviewSummary,
  reviews,
  serviceGroups,
  servicesIn,
  type Photo,
  type Review,
  type ServiceGroup,
} from './data';
import { pages, type PageId, type PageMeta } from './pages';
import { faqsFor } from './pageFaqs';
import { ArrowLink, Eyebrow, FaqList, Picture } from './ui';
import { useNow } from './useNow';

const fullDays = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];

// Kop van een subpagina: kruimelpad, label, H1, intro en eventueel een foto.
export function PageHeader({
  page,
  eyebrow,
  title,
  intro,
  photo,
}: {
  page: PageMeta;
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  photo?: Photo;
}) {
  return (
    <section className="relative pt-36 md:pt-44 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(201,168,74,0.07)_0%,_transparent_55%)]" />
      <div className={`relative max-w-7xl mx-auto px-6 md:px-8 grid gap-14 ${photo ? 'lg:grid-cols-[1.25fr_1fr] items-end' : ''}`}>
        <div className="max-w-3xl">
          <nav aria-label="Kruimelpad" className="mb-12 rise">
            <ol className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-white/40">
              <li>
                <a href="/" className="hover:text-gold transition-colors">
                  Home
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white/70">
                {page.label}
              </li>
            </ol>
          </nav>
          <div className="rise" style={{ '--d': '60ms' } as React.CSSProperties}>
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
          <h1 className="font-serif text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-7xl mb-8 rise" style={{ '--d': '120ms' } as React.CSSProperties}>
            {title}
          </h1>
          <div className="text-white/60 text-lg leading-relaxed max-w-2xl space-y-4 rise" style={{ '--d': '180ms' } as React.CSSProperties}>
            {intro}
          </div>
        </div>
        {photo && (
          <div className="relative aspect-[4/5] max-h-[560px] w-full max-w-md lg:ml-auto overflow-hidden">
            <Picture photo={photo} sizes="(min-width: 1024px) 440px, 90vw" priority />
            <span className="unveil" style={{ '--d': '150ms' } as React.CSSProperties} aria-hidden="true" />
          </div>
        )}
      </div>
    </section>
  );
}

// Kop boven een sectie: nummer, label en titel.
export function SectionTitle({
  number,
  eyebrow,
  children,
  center = false,
  aside,
}: {
  number?: string;
  eyebrow: string;
  children: ReactNode;
  center?: boolean;
  aside?: ReactNode;
}) {
  return (
    <div className={`mb-14 md:mb-20 flex flex-col gap-6 ${center ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`} data-reveal>
      <div>
        <Eyebrow number={number}>{eyebrow}</Eyebrow>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] max-w-3xl">{children}</h2>
      </div>
      {aside}
    </div>
  );
}

export function BookButton({ children = 'Afspraak maken', href = '/#afspraak' }: { children?: ReactNode; href?: string }) {
  return (
    <a href={href} className="btn btn-primary">
      <Calendar className="w-4 h-4" aria-hidden="true" />
      {children}
    </a>
  );
}

export function TrustStrip() {
  return (
    <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-white/55">
      <li className="flex items-center gap-2">
        <span className="flex text-gold" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-gold" />
          ))}
        </span>
        <span>
          <strong className="text-white font-normal">{reviewSummary.rating}</strong> uit {reviewSummary.count} reviews op {reviewSummary.source}
        </span>
      </li>
      <li>
        Sinds <strong className="text-white font-normal">{business.since}</strong> aan de schaar
      </li>
      <li>
        {business.address.district}, {business.address.area}
      </li>
    </ul>
  );
}

// Vandaag open of dicht. Vooraf gerenderd staat er de vaste tekst; in de
// browser komt de dagstatus erbij.
function TodayStatus() {
  const now = useNow();
  if (!now) return <p className="text-white/60 text-sm">{openingSummary}, op afspraak.</p>;
  const today = openingForJsDay(now.getDay());
  const hour = now.getHours();
  const openNow = Boolean(today.opens) && hour >= 9 && hour < 17;
  const tomorrow = openingForJsDay((now.getDay() + 1) % 7);
  return (
    <p className="flex items-center gap-3 text-sm text-white/70">
      <span className={`w-2 h-2 rounded-full ${openNow ? 'bg-emerald-400' : 'bg-white/30'}`} aria-hidden="true" />
      {openNow
        ? `Nu open, tot ${today.closes}`
        : today.opens && hour < 9
          ? `Vandaag open vanaf ${today.opens}`
          : tomorrow.opens
            ? `Nu gesloten · morgen (${fullDays[(now.getDay() + 1) % 7]}) open vanaf ${tomorrow.opens}`
            : 'Nu gesloten · online boeken kan altijd'}
    </p>
  );
}

// De online agenda van Salonized, met de belangrijkste info ernaast.
export function BookingSection({ number }: { number?: string }) {
  return (
    <section id="afspraak" className="py-28 md:py-36 relative scroll-mt-20 bg-[#0a0a09]">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid gap-14 lg:grid-cols-[1fr_1.6fr]">
        <div data-reveal>
          <Eyebrow number={number}>Online agenda</Eyebrow>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-8">
            Plan je <em className="text-gold">afspraak</em>
          </h2>
          <p className="text-white/60 leading-relaxed mb-10 max-w-sm">
            Kies je behandeling en een tijd die je uitkomt; je krijgt direct een bevestiging. Online boeken kan dag en nacht.
          </p>
          <div className="space-y-6 border-t border-white/10 pt-8">
            <TodayStatus />
            <div className="flex flex-col gap-3 text-sm">
              <a href={business.phone.href} className="inline-flex items-center gap-3 text-white/80 hover:text-gold transition-colors">
                <Phone className="w-4 h-4 text-gold" aria-hidden="true" />
                {business.phone.display}
              </a>
              <a href={business.phone.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-white/80 hover:text-gold transition-colors">
                <MessageCircle className="w-4 h-4 text-gold" aria-hidden="true" />
                Stuur een appje
              </a>
            </div>
            <ArrowLink href={pages.prijzen.path}>Bekijk alle prijzen</ArrowLink>
          </div>
        </div>
        <div data-reveal style={{ '--d': '100ms' } as React.CSSProperties}>
          <div className="border border-white/10 bg-[#0d0d0c] p-2 md:p-3">
            <iframe
              src={business.booking}
              width="100%"
              height="720"
              style={{ border: 'none', background: 'transparent' }}
              title="Online agenda van Barber Iwan"
              loading="lazy"
            />
          </div>
          <p className="text-white/40 text-xs mt-4">
            Laadt de agenda niet?{' '}
            <a href={business.booking} target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-4">
              Open hem in een nieuw venster
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

// Prijslijst als menukaart.
export function PriceMenu({ groups, compact = false }: { groups: ServiceGroup[]; compact?: boolean }) {
  return (
    <div className={`grid gap-x-16 gap-y-14 ${compact ? 'md:grid-cols-2' : ''}`}>
      {serviceGroups
        .filter((g) => groups.includes(g.id))
        .map((group) => (
          <div key={group.id} data-reveal>
            <h3 className="font-serif text-3xl md:text-4xl mb-2">{group.title}</h3>
            <p className="text-white/45 text-sm mb-8">{group.intro}</p>
            <ul className="space-y-7">
              {servicesIn(group.id).map((s) => (
                <li key={s.id}>
                  <div className="menu-row">
                    <span className="font-serif text-xl md:text-2xl text-white">{s.name}</span>
                    <span className="dots" aria-hidden="true" />
                    <span className="font-serif text-xl md:text-2xl text-gold tabular-nums">{formatPrice(s.price)}</span>
                  </div>
                  {!compact && (
                    <p className="text-white/50 text-sm mt-1.5">
                      {s.description} <span className="text-white/30">· {s.minutes} min</span>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}

export function PricesNote() {
  return (
    <p className="text-white/35 text-xs mt-12">
      Prijzen zoals in de online agenda ({PRICES_CHECKED}). Betalen kan met pin, contant of Tikkie.
    </p>
  );
}

const specialtyPhotos: Partial<Record<PageId, Photo>> = {
  fade: photos.buzz,
  'black-hair': photos.afroTop,
  baard: photos.fullBeard,
  kinderen: photos.kid,
};

const specialtyText: Partial<Record<PageId, string>> = {
  fade: 'Low, mid, high of skin: een vloeiende overgang en scherpe lijnen.',
  'black-hair': 'Afro, kroes en krullen, met fades, line-ups en geschoren figuren.',
  baard: 'Trimmen, shapen en strakke contouren, los of samen met je knipbeurt.',
  kinderen: 'Een rustige, nette knipbeurt voor jongens van 1 tot en met 12 jaar.',
};

export function SpecialtyCards({ ids, exclude }: { ids: PageId[]; exclude?: PageId }) {
  const list = ids.filter((id) => id !== exclude);
  return (
    <ul className={`grid gap-x-4 gap-y-10 sm:gap-6 grid-cols-2 ${list.length > 3 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
      {list.map((id, i) => {
        const photo = specialtyPhotos[id]!;
        return (
          <li key={id} data-reveal style={{ '--d': `${i * 70}ms` } as React.CSSProperties}>
            <a href={pages[id].path} className="group block">
              <div className="img-hover relative aspect-[4/5] border border-white/10 bg-[#0d0d0c]">
                <Picture photo={photo} sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute left-4 bottom-4 right-4 sm:left-5 sm:bottom-5 font-serif text-2xl sm:text-3xl leading-tight">{pages[id].label}</span>
              </div>
              <p className="text-white/50 text-[13px] sm:text-sm leading-relaxed mt-4">{specialtyText[id]}</p>
              <span className="link-arrow mt-4">
                Meer weten
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function Stars({ size = 'w-4 h-4' }: { size?: string }) {
  return (
    <span className="flex gap-0.5 text-gold" role="img" aria-label="5 van de 5 sterren">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${size} fill-gold`} aria-hidden="true" />
      ))}
    </span>
  );
}

function ReviewCard({ review, featured = false }: { review: Review; featured?: boolean }) {
  return (
    <figure className={`flex flex-col h-full ${featured ? '' : 'border-t border-white/10 pt-8'}`}>
      <Stars size={featured ? 'w-5 h-5' : 'w-3.5 h-3.5'} />
      <blockquote className={`mt-6 flex-1 font-serif ${featured ? 'text-3xl md:text-4xl leading-snug' : 'text-xl leading-relaxed text-white/85'}`}>
        <p>“{review.text}”</p>
      </blockquote>
      <figcaption className="mt-6 text-sm text-white/45">
        <span className="text-white/80">{review.name}</span> · geverifieerde review op {reviewSummary.source}
      </figcaption>
    </figure>
  );
}

// Echte, geverifieerde reviews met bron. Geen sterren-markup in schema.org:
// Google accepteert geen reviews van een andere site als eigen beoordeling.
export function ReviewsSection({ topic, title, number }: { topic?: Review['topic']; title?: ReactNode; number?: string }) {
  const list = topic ? reviews.filter((r) => r.topic === topic) : reviews;
  const [featured, ...rest] = list;
  return (
    <section id="reviews" className="py-28 md:py-36 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionTitle
          number={number}
          eyebrow="Reviews"
          aside={
            <p className="text-white/55 text-sm md:text-right">
              <span className="font-serif text-5xl text-white block leading-none mb-2">{reviewSummary.rating}</span>
              uit {reviewSummary.count} geverifieerde reviews op {reviewSummary.source} ({reviewSummary.checked})
            </p>
          }
        >
          {title ?? (
            <>
              Wat klanten <em className="text-gold">zeggen</em>
            </>
          )}
        </SectionTitle>

        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div data-reveal>
            <ReviewCard review={featured} featured />
          </div>
          <div className="grid gap-10 sm:grid-cols-2">
            {rest.map((review, i) => (
              <div key={review.name} data-reveal style={{ '--d': `${i * 60}ms` } as React.CSSProperties}>
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4" data-reveal>
          <ArrowLink href={reviewSummary.url} external>
            Alle reviews op Treatwell
          </ArrowLink>
          <ArrowLink href={business.maps.place} external>
            Reviews op Google
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ page, title, number }: { page: PageMeta; title?: ReactNode; number?: string }) {
  const items = faqsFor(page.id);
  if (!items.length) return null;
  return (
    <section id="vragen" className="py-28 md:py-36 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <SectionTitle number={number} eyebrow="Vragen">
          {title ?? (
            <>
              Veelgestelde <em className="text-gold">vragen</em>
            </>
          )}
        </SectionTitle>
        <div data-reveal>
          <FaqList items={items} />
        </div>
        <p className="mt-10 text-white/50 text-sm" data-reveal>
          Staat je vraag er niet tussen? Bel{' '}
          <a href={business.phone.href} className="text-gold hover:text-white transition-colors">
            {business.phone.plain}
          </a>{' '}
          of{' '}
          <a href={business.phone.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white transition-colors">
            stuur een appje
          </a>
          .
        </p>
      </div>
    </section>
  );
}

export function OpeningHoursList() {
  return (
    <dl className="border-t border-white/10">
      {openingHours.map((d) => (
        <div key={d.day} className="flex justify-between items-center py-3 border-b border-white/[0.06]">
          <dt className={`text-sm ${d.opens ? 'text-white/70' : 'text-white/35'}`}>{d.day}</dt>
          <dd className={`text-sm tabular-nums ${d.opens ? 'text-white/85' : 'text-white/30'}`}>
            {d.opens ? `${d.opens} – ${d.closes}` : 'Gesloten'}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ContactDetails() {
  const a = business.address;
  return (
    <div className="grid gap-12 sm:grid-cols-2">
      <div>
        <p className="eyebrow mb-5">
          <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
          Adres
        </p>
        <address className="not-italic font-serif text-2xl leading-snug">
          {a.street}
          <br />
          {a.postalCode} {a.city}
        </address>
        <p className="text-white/45 text-sm mt-2">
          {a.district}, {a.area}
        </p>
        <div className="mt-5">
          <ArrowLink href={business.maps.directions} external>
            Route plannen
          </ArrowLink>
        </div>
      </div>
      <div>
        <p className="eyebrow mb-5">
          <Phone className="w-3.5 h-3.5" aria-hidden="true" />
          Bellen of appen
        </p>
        <p className="font-serif text-2xl">
          <a href={business.phone.href} className="hover:text-gold transition-colors">
            {business.phone.display}
          </a>
        </p>
        <div className="mt-5">
          <ArrowLink href={business.phone.whatsapp} external>
            WhatsApp
          </ArrowLink>
        </div>
      </div>
      <div className="sm:col-span-2 max-w-md">
        <p className="eyebrow mb-5">Openingstijden</p>
        <OpeningHoursList />
        <p className="text-white/40 text-xs mt-3">Uitsluitend op afspraak.</p>
      </div>
    </div>
  );
}

export function MapEmbed() {
  return (
    <div className="relative aspect-square lg:aspect-auto lg:h-full min-h-[360px] border border-white/10 overflow-hidden" data-reveal>
      <iframe
        src={business.maps.embed}
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Kaart: Barber Iwan, Michelangelostraat 195 in Almere"
      />
    </div>
  );
}

export function CtaSection({ title, text, href }: { title?: ReactNode; text?: string; href?: string }) {
  return (
    <section className="py-28 md:py-40 relative overflow-hidden border-t border-white/[0.06]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,74,0.08)_0%,_transparent_60%)]" />
      <div className="relative max-w-4xl mx-auto px-6 md:px-8 text-center" data-reveal>
        <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.02] mb-8">
          {title ?? (
            <>
              Klaar voor een <em className="text-gold">nieuwe look</em>?
            </>
          )}
        </h2>
        <p className="text-white/55 mb-12 text-lg">{text ?? 'Ruim dertig jaar vakmanschap, één afspraak verwijderd.'}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <BookButton href={href} />
          <a href={business.phone.href} className="btn btn-ghost">
            <Phone className="w-4 h-4" aria-hidden="true" />
            {business.phone.plain}
          </a>
        </div>
      </div>
    </section>
  );
}

// Doorverwijzing naar verwante pagina's onderaan een subpagina.
export function RelatedPages({ ids }: { ids: PageId[] }) {
  return (
    <section className="pb-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="eyebrow mb-8">Verder lezen</p>
        <ul className="grid gap-px bg-white/10 border border-white/10 md:grid-cols-3">
          {ids.map((id) => (
            <li key={id} className="bg-[#080808]">
              <a href={pages[id].path} className="group flex items-center justify-between p-8 hover:bg-white/[0.02] transition-colors">
                <span className="font-serif text-2xl md:text-3xl">{pages[id].label}</span>
                <ArrowRight className="w-5 h-5 text-gold transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Marquee() {
  const items = ['Fades', 'Tapers', 'Line-ups', 'Baard', 'Black & Mixed hair', 'Krullen & afro', 'Geschoren figuren', 'Kinderen', 'Klassieke coupes'];
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center font-serif italic text-3xl md:text-4xl text-white/70 px-8">
          {item}
          <span className="ml-16 text-gold not-italic text-base" aria-hidden="true">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee overflow-hidden border-y border-white/[0.06] py-8 select-none">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
