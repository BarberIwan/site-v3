import { ArrowRight, Check, Instagram, Navigation } from 'lucide-react';
import { allWork, business, extra, formatPrice, instagram, reviewSummary, serviceById, servicesIn, work, type Photo } from '../data';
import { pages } from '../pages';
import {
  BookButton,
  BookingSection,
  ContactDetails,
  CtaSection,
  FaqSection,
  MapEmbed,
  PageHeader,
  PriceList,
  RelatedPages,
  ReviewsSection,
} from '../sections';
import { Picture, SectionLabel } from '../ui';

function PhotoFigure({ photo, sizes }: { photo: Photo; sizes: string }) {
  return (
    <figure className="group">
      <div className="relative overflow-hidden border border-white/10 img-zoom" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
        <Picture photo={photo} sizes={sizes} />
      </div>
      <figcaption className="mt-3">
        <span className="block font-serif text-xl">{photo.title}</span>
        <span className="block text-white/50 text-sm">{photo.caption}</span>
      </figcaption>
    </figure>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item} className="flex gap-4 text-white/70 leading-relaxed">
          <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Prices() {
  const page = pages.prijzen;
  return (
    <>
      <PageHeader
        page={page}
        eyebrow="Prijslijst"
        title={
          <>
            Behandelingen <span className="italic text-gold">&amp; prijzen</span>
          </>
        }
        intro={
          <p>
            Wat een knipbeurt, fade, baard of kinderkapsel kost bij Barber Iwan in Almere. Elke behandeling is op afspraak: kies in de agenda hieronder een tijd die je uitkomt.
          </p>
        }
      />
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-8">
          <PriceList groups={['heren', 'kinderen', 'late-night']} />
        </div>
      </section>
      <BookingSection intro="Kies je behandeling en tijd. De prijzen in de agenda zijn dezelfde als hierboven." />
      <FaqSection page={page} title={<>Vragen over <span className="italic text-gold">prijzen</span></>} />
      <RelatedPages ids={['black-hair', 'kinderen', 'haircuts']} />
    </>
  );
}

export function Haircuts() {
  const page = pages.haircuts;
  return (
    <>
      <PageHeader
        page={page}
        eyebrow="Portfolio"
        title={
          <>
            Haircuts <span className="italic text-gold">&amp; fades</span>
          </>
        }
        intro={
          <p>
            Een greep uit het werk van Barber Iwan: fades en tapers, krullen en afro, baarden, lang haar en kinderkapsels. Allemaal echte klanten, geknipt in Almere. Meer zie je op{' '}
            <a href={business.instagram.url} target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-4">
              Instagram
            </a>
            .
          </p>
        }
      />
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-8">
          <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {allWork.map((photo) => (
              <li key={photo.file}>
                <PhotoFigure photo={photo} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" />
              </li>
            ))}
          </ul>
          <div className="text-center mt-16">
            <a
              href={business.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-white/20 px-8 py-4 text-white/70 hover:text-gold hover:border-gold/50 transition-all font-sans text-xs tracking-[0.2em] uppercase"
            >
              <Instagram className="w-4 h-4" aria-hidden="true" />
              Meer op Instagram
            </a>
          </div>
        </div>
      </section>
      <CtaSection title={<>Zin in een <span className="italic text-gold">verse cut</span>?</>} />
      <RelatedPages ids={['prijzen', 'black-hair', 'kinderen']} />
    </>
  );
}

export function BlackHair() {
  const page = pages['black-hair'];
  const knippen = serviceById('knippen');
  return (
    <>
      <PageHeader
        page={page}
        eyebrow="Specialisatie"
        title={
          <>
            Kapper voor Black, Mixed <span className="italic text-gold">en krullend haar</span> in Almere
          </>
        }
        intro={
          <>
            <p>
              Afro-, kroes- en krullend haar vraagt om een kapper die weet hoe het valt en groeit. Iwan knipt al ruim dertig jaar alle haartypes — Europees, Aziatisch, Black en Mixed hair — en geeft elke textuur de aanpak die erbij hoort.
            </p>
            <p>
              Een strakke fade, een scherpe line-up, krullen in model of een figuur in je haar: je zit in Almere goed bij Barber Iwan.
            </p>
          </>
        }
      />

      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-8 grid gap-16 lg:grid-cols-2 items-start">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl mb-8">Wat ik voor je doe</h2>
            <CheckList
              items={[
                'Fades en tapers: low, mid, high of skin, met een vloeiende overgang.',
                'Strakke line-ups en contouren rond je haarlijn, nek en baard.',
                'Krullen of afro bovenop netjes in model, zonder de textuur kwijt te raken.',
                'Geschoren figuren en lijnen; neem een voorbeeld mee of laat Iwan iets ontwerpen.',
                'Baard trimmen en shapen, los of samen met je knipbeurt.',
                'Kinderen van 1 tot en met 12 jaar, rustig en vlot.',
              ]}
            />
            <div className="mt-10 border border-white/10 p-6">
              <p className="text-white/50 text-sm mb-2">Knippen of fade</p>
              <p className="font-serif text-4xl text-gold">{formatPrice(knippen.price)}</p>
              <p className="text-white/40 text-xs mt-2">
                {knippen.minutes} minuten · knippen + baard {formatPrice(serviceById('knippen-baard').price)} ·{' '}
                <a href={pages.prijzen.path} className="text-gold underline underline-offset-4">
                  alle prijzen
                </a>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[extra.afro, extra.design, work[1], instagram[0]].map((photo) => (
              <PhotoFigure key={photo.file} photo={photo} sizes="(min-width: 1024px) 260px, 50vw" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-8">
          <SectionLabel>Waarom Barber Iwan</SectionLabel>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              { title: 'Ruim 30 jaar ervaring', text: 'Sinds 1994 aan de schaar, met alle haartypes en texturen.' },
              { title: 'Tijd voor je haar', text: 'Uitsluitend op afspraak, dus geen haast en geen wachtrij.' },
              {
                title: `${reviewSummary.rating} op ${reviewSummary.source}`,
                text: `Gemiddelde score uit ${reviewSummary.count} geverifieerde reviews (${reviewSummary.checked}).`,
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-serif text-2xl mb-3">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection page={page} />
      <CtaSection />
      <RelatedPages ids={['prijzen', 'haircuts', 'kinderen']} />
    </>
  );
}

export function Kids() {
  const page = pages.kinderen;
  return (
    <>
      <PageHeader
        page={page}
        eyebrow="Kinderen"
        title={
          <>
            Kinderkapper <span className="italic text-gold">in Almere</span>
          </>
        }
        intro={
          <p>
            Bij Barber Iwan kunnen kinderen van 1 tot en met 12 jaar terecht voor een rustige, nette knipbeurt. Ouders noemen in hun reviews vooral hoe goed Iwan luistert en hoe kalm hij kleine kinderen krijgt.
          </p>
        }
      />

      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-8 grid gap-16 lg:grid-cols-[1.2fr_1fr] items-start">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl mb-8">Prijzen voor kinderen</h2>
            <ul className="border-t border-white/10">
              {servicesIn('kinderen').map((s) => (
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
            <div className="mt-10 space-y-4 text-white/60 leading-relaxed">
              <p>Wil je zelf ook geknipt worden? Boek dan aansluitend je eigen afspraak.</p>
            </div>
            <div className="mt-10">
              <BookButton>Afspraak maken</BookButton>
            </div>
          </div>
          <div className="grid gap-6">
            <PhotoFigure photo={extra.kid} sizes="(min-width: 1024px) 420px, 100vw" />
            <PhotoFigure photo={instagram[1]} sizes="(min-width: 1024px) 420px, 100vw" />
          </div>
        </div>
      </section>

      <ReviewsSection topic="kinderen" title={<>Wat <span className="italic text-gold">ouders</span> zeggen</>} />
      <FaqSection page={page} title={<>Vragen over <span className="italic text-gold">kinderen knippen</span></>} />
      <RelatedPages ids={['prijzen', 'haircuts', 'contact']} />
    </>
  );
}

export function Contact() {
  const page = pages.contact;
  const a = business.address;
  return (
    <>
      <PageHeader
        page={page}
        eyebrow="Contact"
        title={
          <>
            Contact <span className="italic text-gold">&amp; route</span>
          </>
        }
        intro={
          <p>
            Barber Iwan zit aan de {a.street} in de Almeerse wijk {a.district}. Je bent welkom op afspraak, van dinsdag tot en met zaterdag tussen 09:00 en 17:00.
          </p>
        }
      />
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-20">
          <div>
            <ContactDetails />
            <div className="flex flex-wrap gap-4 mt-12">
              <BookButton />
              <a
                href={business.maps.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-white/20 px-8 py-4 text-white/70 hover:text-gold hover:border-gold/50 transition-all font-sans text-xs tracking-[0.2em] uppercase"
              >
                <Navigation className="w-4 h-4" aria-hidden="true" />
                Route plannen
              </a>
            </div>
            <div className="flex items-center gap-4 mt-12 pt-12 border-t border-white/10 text-sm text-white/60">
              <span className="text-xs tracking-[0.2em] uppercase text-white/40 font-sans">Volg</span>
              <a href={business.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                Instagram
              </a>
              <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                Facebook
              </a>
              <a href={business.treatwell} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                Treatwell
              </a>
            </div>
          </div>
          <MapEmbed />
        </div>
      </section>
      <FaqSection page={page} title={<>Route &amp; <span className="italic text-gold">parkeren</span></>} />
      <RelatedPages ids={['prijzen', 'haircuts', 'black-hair']} />
    </>
  );
}

export function NotFound() {
  return (
    <section className="pt-48 pb-32">
      <div className="max-w-3xl mx-auto px-8 text-center">
        <SectionLabel center>404</SectionLabel>
        <h1 className="font-serif text-5xl md:text-6xl mb-6">
          Deze pagina <span className="italic text-gold">bestaat niet</span>
        </h1>
        <p className="text-white/60 mb-12">Misschien is hij verhuisd. Hier vind je alles terug:</p>
        <ul className="flex flex-wrap justify-center gap-4">
          {(['home', 'prijzen', 'haircuts', 'contact'] as const).map((id) => (
            <li key={id}>
              <a href={pages[id].path} className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-white/70 hover:text-gold hover:border-gold/50 transition-all text-xs tracking-[0.2em] uppercase">
                {pages[id].label}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
