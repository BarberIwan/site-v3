import { business, photos, reviewSummary, type Photo } from '../data';
import { pages, specialties } from '../pages';
import {
  BookButton,
  BookingSection,
  ContactDetails,
  CtaSection,
  FaqSection,
  Marquee,
  MapEmbed,
  PriceMenu,
  PricesNote,
  ReviewsSection,
  SectionTitle,
  SpecialtyCards,
  TrustStrip,
} from '../sections';
import { ArrowLink, Eyebrow, Picture } from '../ui';

const d = (ms: number) => ({ '--d': `${ms}ms` }) as React.CSSProperties;

function Hero() {
  return (
    <section className="relative min-h-[100svh] pt-32 pb-20 flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,_rgba(201,168,74,0.08)_0%,_transparent_55%)]" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-8 w-full grid gap-16 lg:grid-cols-[1.15fr_1fr] items-center">
        <div>
          <h1>
            <span className="eyebrow mb-10 rise">Kapper & barber in {business.address.area}</span>
            <span className="block font-serif text-[3.4rem] leading-[0.95] sm:text-7xl lg:text-[6.75rem] rise" style={d(60)}>
              Vakmanschap
            </span>
            <span className="block font-serif italic text-gold text-[3.4rem] leading-[1] sm:text-7xl lg:text-[6.75rem] rise" style={d(140)}>
              met karakter
            </span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-white/60 leading-relaxed max-w-lg rise" style={d(220)}>
            Sinds {business.since} aan de schaar. Fades, klassieke coupes, baard en kinderkapsels, voor Europees, Aziatisch, Black en Mixed hair.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4 rise" style={d(300)}>
            <BookButton href="#afspraak">Plan je afspraak</BookButton>
            <a href={pages.haircuts.path} className="btn btn-ghost">
              Bekijk het werk
            </a>
          </div>
          <div className="mt-14 pt-8 border-t border-white/10 rise" style={d(380)}>
            <TrustStrip />
          </div>
        </div>

        <div className="relative pb-10 sm:pb-16">
          <figure className="relative ml-auto w-[80%] aspect-[3/4] overflow-hidden">
            <Picture photo={photos.midFade} sizes="(min-width: 1024px) 460px, 80vw" priority />
            <span className="unveil" style={d(80)} aria-hidden="true" />
          </figure>
          <figure className="absolute left-0 bottom-0 w-[46%] aspect-[3/4] overflow-hidden outline outline-[6px] outline-[#080808]">
            <Picture photo={photos.afroTop} sizes="(min-width: 1024px) 260px, 45vw" />
            <span className="unveil" style={d(260)} aria-hidden="true" />
          </figure>
          <p className="hidden sm:block absolute -left-2 top-8 origin-top-left rotate-90 translate-x-4 text-[10px] tracking-[0.4em] uppercase text-white/35 rise" style={d(500)}>
            Uit de stoel · {business.address.city}
          </p>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="over" className="py-28 md:py-40 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div data-reveal>
          <Eyebrow number="01">Over Iwan</Eyebrow>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
            Ruim dertig jaar <em className="text-gold">passie voor het vak</em>
          </h2>
          <blockquote className="mt-12 border-l border-gold/50 pl-8 font-serif italic text-2xl md:text-3xl text-white/80 leading-snug max-w-md">
            “Een goede barber begrijpt niet alleen haar, maar de persoon erachter.”
          </blockquote>
        </div>
        <div className="space-y-6 text-white/60 leading-relaxed text-lg" data-reveal style={d(100)}>
          <p>
            Wat begon als een jongensdroom in {business.since}, groeide uit tot een levenslange missie: het ambacht van het barbierschap perfectioneren. Ik knip alle haartypes — Europees, Aziatisch, Black en Mixed hair — elk met zijn eigen eigenschappen.
          </p>
          <p>
            Bij Barber Iwan draait het niet alleen om een knipbeurt. Het is een moment van rust, persoonlijke aandacht en het vertrouwen dat je in goede handen bent. Van een strakke taper fade tot een geschoren figuur: elk kapsel krijgt de tijd die het nodig heeft.
          </p>
          <dl className="grid grid-cols-3 gap-6 pt-10 mt-4 border-t border-white/10">
            {[
              { value: '30+', label: 'Jaar ervaring' },
              { value: '4', label: 'Haartypes' },
              { value: reviewSummary.rating, label: `Op ${reviewSummary.source}` },
            ].map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-serif text-4xl md:text-5xl text-gold leading-none">{s.value}</dd>
                <dd className="text-[11px] tracking-[0.2em] uppercase text-white/40 mt-3">{s.label}</dd>
              </div>
            ))}
          </dl>
          <div className="pt-6">
            <ArrowLink href={pages.over.path}>Het verhaal van Iwan</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}

const galleryPick: { photo: Photo; className: string }[] = [
  { photo: photos.cornrows, className: 'md:col-span-5 md:row-span-2' },
  { photo: photos.taper, className: 'md:col-span-4' },
  { photo: photos.design, className: 'md:col-span-3' },
  { photo: photos.wavy, className: 'md:col-span-3' },
  { photo: photos.longHair, className: 'md:col-span-4' },
];

function Work() {
  return (
    <section id="werk" className="py-28 md:py-40 scroll-mt-20 bg-[#0a0a09]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionTitle number="04" eyebrow="Werk" aside={<ArrowLink href={pages.haircuts.path}>Alle haircuts</ArrowLink>}>
          Uit de <em className="text-gold">stoel</em>
        </SectionTitle>
        <ul className="grid grid-cols-2 md:grid-cols-12 md:auto-rows-[minmax(0,1fr)] gap-4 md:gap-5">
          {galleryPick.map(({ photo, className }, i) => (
            <li key={photo.slug} className={`${className} ${i === 0 ? 'col-span-2' : ''}`} data-reveal style={d(i * 60)}>
              <a href={pages.haircuts.path} className="group block h-full">
                <figure className="h-full flex flex-col">
                  <div className={`img-hover relative flex-1 border border-white/10 ${i === 0 ? 'aspect-[4/5] md:aspect-auto' : 'aspect-[3/4]'}`}>
                    <Picture photo={photo} sizes={i === 0 ? '(min-width: 768px) 520px, 100vw' : '(min-width: 768px) 360px, 50vw'} />
                  </div>
                  <figcaption className="mt-3 text-sm text-white/55">{photo.title}</figcaption>
                </figure>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />

      <section id="specialisaties" className="py-28 md:py-36 scroll-mt-20 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionTitle number="02" eyebrow="Specialisaties">
            Elk haartype, <em className="text-gold">elke stijl</em>
          </SectionTitle>
          <SpecialtyCards ids={specialties} />
        </div>
      </section>

      <section id="behandelingen" className="py-28 md:py-36 scroll-mt-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <SectionTitle number="03" eyebrow="Behandelingen" aside={<ArrowLink href={pages.prijzen.path}>Alle prijzen</ArrowLink>}>
            Eerlijke <em className="text-gold">prijzen</em>
          </SectionTitle>
          <PriceMenu groups={['heren', 'kinderen']} compact />
          <PricesNote />
        </div>
      </section>

      <Work />
      <BookingSection number="05" />
      <ReviewsSection number="06" />
      <FaqSection page={pages.home} number="07" />

      <section id="contact" className="py-28 md:py-36 scroll-mt-20 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionTitle number="08" eyebrow="Contact" aside={<ArrowLink href={pages.contact.path}>Route en parkeren</ArrowLink>}>
            Kom langs in <em className="text-gold">{business.address.area}</em>
          </SectionTitle>
          <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr]">
            <div data-reveal>
              <ContactDetails />
            </div>
            <MapEmbed />
          </div>
        </div>
      </section>

      <CtaSection href="#afspraak" />
    </>
  );
}
