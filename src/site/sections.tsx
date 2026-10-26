import type { ReactNode } from 'react';
import { ArrowRight, Calendar, Clock, HelpCircle, MapPin, MessageCircle, Navigation, Phone, Star } from 'lucide-react';
import {
  business,
  formatPrice,
  openingHours,
  PRICES_CHECKED,
  reviewSummary,
  reviews,
  serviceGroups,
  servicesIn,
  type Review,
  type ServiceGroup,
} from './data';
import { pages, type PageMeta } from './pages';
import { faqsFor } from './pageFaqs';
import { FaqList, MagneticLink, SectionLabel, Spotlight, TiltCard } from './ui';

// Kop van een subpagina: kruimelpad, label, H1 en intro.
export function PageHeader({
  page,
  eyebrow,
  title,
  intro,
}: {
  page: PageMeta;
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
}) {
  return (
    <section className="pt-40 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,168,74,0.08)_0%,_transparent_60%)]" />
      <div className="relative max-w-5xl mx-auto px-8">
        <nav aria-label="Kruimelpad" className="mb-10">
          <ol className="flex flex-wrap items-center gap-2 text-xs tracking-widest uppercase text-white/40 font-sans">
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
        <SectionLabel>{eyebrow}</SectionLabel>
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-8">{title}</h1>
        <div className="text-white/60 text-lg leading-relaxed max-w-2xl font-light space-y-4">{intro}</div>
      </div>
    </section>
  );
}

export function BookButton({ children = 'Afspraak maken', href = '/#afspraak' }: { children?: ReactNode; href?: string }) {
  return (
    <MagneticLink
      href={href}
      className="inline-flex items-center btn-cta btn-cta-ring animate-cta-pulse text-black font-sans text-sm tracking-[0.2em] uppercase px-12 py-6 rounded-sm"
    >
      <Calendar className="w-5 h-5 mr-3" aria-hidden="true" />
      {children}
    </MagneticLink>
  );
}

// De online agenda van Salonized. Staat op home en op de prijzenpagina.
export function BookingSection({ intro }: { intro?: string }) {
  return (
    <section id="afspraak" className="py-32 relative overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#080808] to-[#0a0a0a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,74,0.05)_0%,_transparent_60%)]" />

      <div className="relative max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <SectionLabel center>Online agenda</SectionLabel>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
            Boek je <span className="italic text-gold">afspraak</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            {intro ?? 'Kies je behandeling en een tijd die je uitkomt. Je krijgt direct een bevestiging.'}
          </p>
        </div>

        <div className="booking-frame relative">
          <div className="relative border border-white/10 bg-[#0d0d0d]">
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold/50 -mt-px -ml-px animate-pulse" style={{ animationDuration: '3s' }} />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-gold/50 -mt-px -mr-px animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-gold/50 -mb-px -ml-px animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }} />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold/50 -mb-px -mr-px animate-pulse" style={{ animationDuration: '3s', animationDelay: '1.5s' }} />
            <div className="p-2 md:p-4">
              <iframe
                src={business.booking}
                width="100%"
                height="700"
                style={{ border: 'none', background: 'transparent' }}
                title="Online agenda van Barber Iwan"
                loading="lazy"
              />
            </div>
          </div>
          <p className="text-center text-white/40 text-xs mt-4">
            Laadt de agenda niet?{' '}
            <a href={business.booking} target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-4">
              Open de agenda in een nieuw venster
            </a>
            .
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            { icon: Calendar, title: 'Direct bevestigd', desc: 'Je ziet meteen welke tijden vrij zijn.' },
            { icon: Clock, title: 'Dag en nacht boeken', desc: 'Online boeken kan altijd, ook buiten openingstijden.' },
            { icon: Phone, title: 'Liever bellen?', desc: business.phone.display, href: business.phone.href },
          ].map((item) => (
            <TiltCard key={item.title} className="text-center p-6 border border-white/10 hover:border-gold/30 transition-colors group">
              <div className="text-gold text-3xl mb-3 group-hover:scale-110 transition-transform">
                <item.icon className="w-8 h-8 mx-auto" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-xl mb-2">{item.title}</h3>
              {item.href ? (
                <a href={item.href} className="text-white/60 text-sm hover:text-gold transition-colors">
                  {item.desc}
                </a>
              ) : (
                <p className="text-white/60 text-sm">{item.desc}</p>
              )}
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PriceList({ groups }: { groups: ServiceGroup[] }) {
  return (
    <div className="space-y-16">
      {serviceGroups
        .filter((g) => groups.includes(g.id))
        .map((group) => (
          <div key={group.id}>
            <h2 className="font-serif text-3xl md:text-4xl mb-2">{group.title}</h2>
            <p className="text-white/50 text-sm mb-6">{group.intro}</p>
            <ul className="border-t border-white/10">
              {servicesIn(group.id).map((s) => (
                <li key={s.id} className="flex items-start justify-between gap-6 py-5 border-b border-white/10">
                  <div>
                    <h3 className="font-sans text-base tracking-wide text-white">{s.name}</h3>
                    <p className="text-white/50 text-sm mt-1">{s.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-serif text-3xl text-gold leading-none">{formatPrice(s.price)}</p>
                    <p className="text-white/40 text-xs mt-2">{s.minutes} min</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      <p className="text-white/40 text-xs">
        Prijzen zoals in de online agenda ({PRICES_CHECKED}). Betalen kan met pin, contant of Tikkie.
      </p>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="border border-white/10 bg-[#080808] p-6 hover:border-gold/30 transition-all flex flex-col">
      <div className="flex gap-1 mb-4" role="img" aria-label="5 van de 5 sterren">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className="w-4 h-4 text-gold fill-gold" aria-hidden="true" />
        ))}
      </div>
      <blockquote className="text-white/70 text-sm leading-relaxed mb-6 font-sans italic flex-1">
        <p>“{review.text}”</p>
      </blockquote>
      <figcaption className="flex items-center gap-3 pt-4 border-t border-white/10">
        <span className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center" aria-hidden="true">
          <span className="text-gold font-serif text-lg">{review.name.charAt(0)}</span>
        </span>
        <span>
          <span className="block text-white font-sans text-sm">{review.name}</span>
          <span className="block text-white/40 text-xs font-sans">Geverifieerde review op {reviewSummary.source}</span>
        </span>
      </figcaption>
    </figure>
  );
}

// Echte, geverifieerde reviews met bron. Geen sterren-markup in schema.org:
// Google accepteert geen reviews van een andere site als eigen beoordeling.
export function ReviewsSection({ topic, title }: { topic?: Review['topic']; title?: ReactNode }) {
  const list = topic ? reviews.filter((r) => r.topic === topic) : reviews;
  return (
    <section id="reviews" className="py-32 relative overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,74,0.06)_0%,_transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <SectionLabel center>Reviews</SectionLabel>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
            {title ?? (
              <>
                Wat <span className="italic text-gold">klanten</span> zeggen
              </>
            )}
          </h2>
          <p className="flex items-center justify-center gap-3 text-white/60 font-sans text-sm">
            <span className="flex" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-5 h-5 text-gold fill-gold" />
              ))}
            </span>
            <span>
              {reviewSummary.rating} uit 5 op {reviewSummary.source} · {reviewSummary.count} geverifieerde reviews (
              {reviewSummary.checked})
            </span>
          </p>
        </div>

        <div className={`grid gap-6 ${list.length > 2 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 max-w-4xl mx-auto'}`}>
          {list.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a
            href={reviewSummary.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-white/20 px-8 py-4 text-white/60 hover:text-gold hover:border-gold/50 transition-all font-sans text-xs tracking-[0.2em] uppercase"
          >
            <Star className="w-4 h-4 text-gold fill-gold" aria-hidden="true" />
            Alle reviews op Treatwell
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <a
            href={business.maps.place}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-white/20 px-8 py-4 text-white/60 hover:text-gold hover:border-gold/50 transition-all font-sans text-xs tracking-[0.2em] uppercase"
          >
            Reviews op Google
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ page, title }: { page: PageMeta; title?: ReactNode }) {
  const items = faqsFor(page.id);
  if (!items.length) return null;
  return (
    <section id="vragen" className="py-32 relative overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#080808] to-[#0a0a0a]" />
      <div className="relative max-w-4xl mx-auto px-8">
        <div className="text-center mb-16">
          <SectionLabel center>Vragen</SectionLabel>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
            {title ?? (
              <>
                Veelgestelde <span className="italic text-gold">vragen</span>
              </>
            )}
          </h2>
        </div>
        <FaqList items={items} />
        <div className="mt-16 text-center border border-white/10 p-8 bg-[#080808]">
          <HelpCircle className="w-8 h-8 text-gold mx-auto mb-4" aria-hidden="true" />
          <p className="text-white/60 mb-2">Nog een vraag?</p>
          <p className="text-white/40 text-sm mb-4">Bel of app me gerust.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href={business.phone.href} className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors font-sans text-xs tracking-[0.2em] uppercase">
              <Phone className="w-4 h-4" aria-hidden="true" />
              {business.phone.display}
            </a>
            <a
              href={business.phone.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors font-sans text-xs tracking-[0.2em] uppercase"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function OpeningHoursList() {
  return (
    <div className="space-y-0 border-t border-white/10">
      {openingHours.map((d) => (
        <div
          key={d.day}
          className={`flex justify-between items-center py-2.5 border-b border-white/5 ${d.opens ? '' : 'opacity-40'}`}
        >
          <span className={`text-sm font-sans tracking-wide ${d.opens ? 'text-white/70' : 'text-white/40'}`}>{d.day}</span>
          <span className={`text-sm font-sans ${d.opens ? 'text-gold/80' : 'text-white/30 italic'}`}>
            {d.opens ? `${d.opens} — ${d.closes}` : 'Gesloten'}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ContactDetails() {
  const a = business.address;
  return (
    <div className="space-y-8">
      <Spotlight className="flex items-start gap-6 group p-2 -m-2">
        <div className="w-12 h-12 border border-gold/30 flex items-center justify-center flex-shrink-0 group-hover:border-gold group-hover:bg-gold/5 transition-all">
          <MapPin className="w-5 h-5 text-gold" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-2 font-sans">Adres</h3>
          <address className="not-italic text-lg">
            {a.street}
            <br />
            {a.postalCode} {a.city}
          </address>
          <p className="text-white/40 text-sm mt-1">Wijk {a.district}</p>
          <a
            href={business.maps.directions}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-gold text-xs tracking-[0.2em] uppercase hover:text-white transition-colors"
          >
            <Navigation className="w-4 h-4" aria-hidden="true" />
            Route plannen
          </a>
        </div>
      </Spotlight>

      <Spotlight className="flex items-start gap-6 group p-2 -m-2">
        <div className="w-12 h-12 border border-gold/30 flex items-center justify-center flex-shrink-0 group-hover:border-gold group-hover:bg-gold/5 transition-all">
          <Phone className="w-5 h-5 text-gold" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-2 font-sans">Telefoon & WhatsApp</h3>
          <p className="text-lg">
            <a href={business.phone.href} className="hover:text-gold transition-colors">
              {business.phone.display}
            </a>
          </p>
          <a
            href={business.phone.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-gold text-xs tracking-[0.2em] uppercase hover:text-white transition-colors"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            Stuur een appje
          </a>
        </div>
      </Spotlight>

      <Spotlight className="flex items-start gap-6 group p-2 -m-2">
        <div className="w-12 h-12 border border-gold/30 flex items-center justify-center flex-shrink-0 group-hover:border-gold group-hover:bg-gold/5 transition-all">
          <Clock className="w-5 h-5 text-gold" aria-hidden="true" />
        </div>
        <div className="flex-1 max-w-sm">
          <h3 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-4 font-sans">Openingstijden</h3>
          <OpeningHoursList />
          <p className="text-white/40 text-xs mt-3">Uitsluitend op afspraak.</p>
        </div>
      </Spotlight>
    </div>
  );
}

export function MapEmbed() {
  return (
    <TiltCard className="contact-map relative">
      <div className="aspect-square border border-white/10 overflow-hidden">
        <iframe
          src={business.maps.embed}
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Kaart: Barber Iwan, Michelangelostraat 195 in Almere"
        />
      </div>
      <div className="absolute -top-4 -left-4 w-full h-full border border-gold/20 -z-10" />
    </TiltCard>
  );
}

export function CtaSection({ title, text, href }: { title?: ReactNode; text?: string; href?: string }) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,74,0.08)_0%,_transparent_60%)]" />
      <div className="relative max-w-4xl mx-auto px-8 text-center">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">
          {title ?? (
            <>
              Klaar voor een <span className="italic text-gold">nieuwe look</span>?
            </>
          )}
        </h2>
        <p className="text-white/60 mb-10 font-light">
          {text ?? 'Boek je afspraak en ervaar het verschil van ruim dertig jaar vakmanschap.'}
        </p>
        <BookButton href={href} />
      </div>
    </section>
  );
}

// Doorverwijzing naar verwante pagina's onderaan een subpagina.
export function RelatedPages({ ids }: { ids: PageMeta['id'][] }) {
  return (
    <section className="pb-24">
      <div className="max-w-5xl mx-auto px-8 grid gap-4 md:grid-cols-3">
        {ids.map((id) => (
          <a
            key={id}
            href={pages[id].path}
            className="group border border-white/10 p-6 hover:border-gold/40 transition-colors flex items-center justify-between"
          >
            <span className="font-serif text-2xl">{pages[id].label}</span>
            <ArrowRight className="w-5 h-5 text-gold group-hover:translate-x-2 transition-transform" aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}
