import { ArrowRight, Check, Instagram } from 'lucide-react';
import { allWork, business, formatPrice, photos, photosTagged, reviewSummary, serviceById, servicesIn, type Photo } from '../data';
import { Gallery } from '../Gallery';
import { pages } from '../pages';
import {
  BookButton,
  BookingSection,
  ContactDetails,
  CtaSection,
  FaqSection,
  MapEmbed,
  PageHeader,
  PriceMenu,
  PricesNote,
  RelatedPages,
  ReviewsSection,
  SectionTitle,
} from '../sections';
import { ArrowLink, Eyebrow, Picture } from '../ui';

const d = (ms: number) => ({ '--d': `${ms}ms` }) as React.CSSProperties;

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-5">
      {items.map((item, i) => (
        <li key={item} className="flex gap-4 text-white/70 leading-relaxed" data-reveal style={d(i * 50)}>
          <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PriceCard({ ids }: { ids: string[] }) {
  return (
    <div className="border border-white/10 bg-[#0d0d0c] p-8" data-reveal>
      <p className="eyebrow mb-6">Prijzen</p>
      <ul className="space-y-5">
        {ids.map((id) => {
          const s = serviceById(id);
          return (
            <li key={id} className="menu-row">
              <span className="font-serif text-xl">{s.name}</span>
              <span className="dots" aria-hidden="true" />
              <span className="font-serif text-xl text-gold tabular-nums">{formatPrice(s.price)}</span>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-6">
        <BookButton />
        <ArrowLink href={pages.prijzen.path}>Alle prijzen</ArrowLink>
      </div>
    </div>
  );
}

function PhotoStrip({ items, cols = 4 }: { items: Photo[]; cols?: 2 | 4 }) {
  return (
    <ul className={`grid grid-cols-2 gap-4 ${cols === 4 ? 'md:grid-cols-4' : ''}`}>
      {items.slice(0, 4).map((photo, i) => (
        <li key={photo.slug} data-reveal style={d(i * 60)}>
          <figure className="group">
            <div className="img-hover aspect-[3/4] border border-white/10">
              <Picture photo={photo} sizes={cols === 4 ? '(min-width: 768px) 300px, 50vw' : '(min-width: 1024px) 380px, 50vw'} />
            </div>
            <figcaption className="mt-3 text-sm text-white/55">{photo.title}</figcaption>
          </figure>
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
            Behandelingen <em className="text-gold">&amp; prijzen</em>
          </>
        }
        intro={
          <p>
            Wat een knipbeurt, fade, baard of kinderkapsel kost bij Barber Iwan in {business.address.area}. Elke behandeling is op afspraak; kies hieronder een tijd die je uitkomt.
          </p>
        }
      />
      <section className="pb-28">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <PriceMenu groups={['heren', 'kinderen', 'late-night']} />
          <PricesNote />
        </div>
      </section>
      <BookingSection />
      <FaqSection page={page} title={<>Vragen over <em className="text-gold">prijzen</em></>} />
      <RelatedPages ids={['fade', 'black-hair', 'baard']} />
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
            Haircuts <em className="text-gold">&amp; fades</em>
          </>
        }
        intro={
          <p>
            Een greep uit het werk van Barber Iwan: fades en tapers, krullen en afro, lijnen en figuren, baarden en kinderkapsels. Allemaal echte klanten, geknipt in Almere. Meer zie je op{' '}
            <a href={business.instagram.url} target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-4">
              Instagram
            </a>
            .
          </p>
        }
      />
      <section className="pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <Gallery items={allWork} />
          <div className="mt-12">
            <a href={business.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <Instagram className="w-4 h-4" aria-hidden="true" />
              Meer op Instagram
            </a>
          </div>
        </div>
      </section>
      <CtaSection title={<>Zin in een <em className="text-gold">verse cut</em>?</>} />
      <RelatedPages ids={['fade', 'black-hair', 'kinderen']} />
    </>
  );
}

const fadeTypes = [
  { name: 'Low fade', text: 'Begint laag, net boven het oor en in de nek. Subtiel en net, ook op kantoor.' },
  { name: 'Mid fade', text: 'Loopt halverwege de zijkant af. De veelzijdige middenweg tussen strak en rustig.' },
  { name: 'High fade', text: 'Begint hoog op de zijkant voor veel contrast met het bovenhaar.' },
  { name: 'Skin fade', text: 'Loopt af tot op de huid. De strakste variant, vaak gecombineerd met een scherpe line-up.' },
  { name: 'Taper', text: 'Alleen de randen bij de bakkebaarden en in de nek worden korter. Klassiek en tijdloos.' },
];

export function Fade() {
  const page = pages.fade;
  return (
    <>
      <PageHeader
        page={page}
        eyebrow="Specialisatie"
        title={
          <>
            Fade kapper <em className="text-gold">in Almere</em>
          </>
        }
        intro={
          <>
            <p>
              Een goede fade zie je aan wat je niet ziet: geen harde overgangen, geen trapjes, maar een lijn die vloeiend van kort naar lang loopt. Iwan knipt fades al ruim dertig jaar, in elk haartype van steil tot kroes.
            </p>
            <p>Low, mid, high, skin of een klassieke taper: in de stoel kijken we samen wat bij je hoofdvorm en haar past.</p>
          </>
        }
        photo={photos.buzz}
      />

      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionTitle eyebrow="Soorten fades">
            Welke fade <em className="text-gold">past bij jou?</em>
          </SectionTitle>
          <ul className="grid gap-px bg-white/10 border border-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {fadeTypes.map((f, i) => (
              <li key={f.name} className="bg-[#080808] p-8" data-reveal style={d(i * 60)}>
                <span className="text-gold/60 font-serif text-sm">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-serif text-3xl mt-3 mb-3">{f.name}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid gap-14 lg:grid-cols-[1.4fr_1fr] items-start">
          <div>
            <Eyebrow>Uit de stoel</Eyebrow>
            <h2 className="font-serif text-4xl md:text-5xl mb-10" data-reveal>
              Fades van <em className="text-gold">Barber Iwan</em>
            </h2>
            <PhotoStrip items={photosTagged('fades')} cols={2} />
            <div className="mt-8">
              <ArrowLink href={pages.haircuts.path}>Alle haircuts</ArrowLink>
            </div>
          </div>
          <PriceCard ids={['knippen', 'knippen-baard']} />
        </div>
      </section>

      <FaqSection page={page} title={<>Vragen over <em className="text-gold">fades</em></>} />
      <CtaSection />
      <RelatedPages ids={['black-hair', 'baard', 'prijzen']} />
    </>
  );
}

export function BlackHair() {
  const page = pages['black-hair'];
  return (
    <>
      <PageHeader
        page={page}
        eyebrow="Specialisatie"
        title={
          <>
            Black &amp; Mixed hair <em className="text-gold">kapper in Almere</em>
          </>
        }
        intro={
          <>
            <p>
              Afro-, kroes- en krullend haar vraagt om een kapper die weet hoe het valt en groeit. Iwan knipt al ruim dertig jaar alle haartypes — Europees, Aziatisch, Black en Mixed hair — en geeft elke textuur de aanpak die erbij hoort.
            </p>
            <p>Een strakke fade, een scherpe line-up, krullen in model of een figuur in je haar: je zit in {business.address.area} goed bij Barber Iwan.</p>
          </>
        }
        photo={photos.afroTop}
      />

      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid gap-16 lg:grid-cols-[1.2fr_1fr] items-start">
          <div>
            <SectionTitle eyebrow="Wat ik voor je doe">
              Vakwerk voor <em className="text-gold">elke textuur</em>
            </SectionTitle>
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
          </div>
          <PriceCard ids={['knippen', 'knippen-baard', 'baard']} />
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <PhotoStrip items={[photos.afro, photos.design, photos.cornrows, photos.wavy]} />
        </div>
      </section>

      <section className="py-24 bg-[#0a0a09]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid gap-12 md:grid-cols-3">
          {[
            { title: 'Ruim 30 jaar ervaring', text: `Sinds ${business.since} aan de schaar, met alle haartypes en texturen.` },
            { title: 'Tijd voor je haar', text: 'Uitsluitend op afspraak, dus geen haast en geen wachtrij.' },
            {
              title: `${reviewSummary.rating} op ${reviewSummary.source}`,
              text: `Gemiddelde score uit ${reviewSummary.count} geverifieerde reviews (${reviewSummary.checked}).`,
            },
          ].map((item, i) => (
            <div key={item.title} data-reveal style={d(i * 70)}>
              <h3 className="font-serif text-3xl mb-3">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <FaqSection page={page} />
      <CtaSection />
      <RelatedPages ids={['fade', 'haircuts', 'kinderen']} />
    </>
  );
}

export function Beard() {
  const page = pages.baard;
  return (
    <>
      <PageHeader
        page={page}
        eyebrow="Specialisatie"
        title={
          <>
            Baard trimmen <em className="text-gold">in Almere</em>
          </>
        }
        intro={
          <>
            <p>
              Een verzorgde baard maakt het verschil tussen laten groeien en laten zien. Bij Barber Iwan in {business.address.area} wordt je baard op lengte gebracht, in vorm gezet en strak afgewerkt.
            </p>
            <p>Los als korte afspraak, of samen met je knipbeurt voor de complete look.</p>
          </>
        }
        photo={photos.fullBeard}
      />

      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid gap-16 lg:grid-cols-[1.2fr_1fr] items-start">
          <div>
            <SectionTitle eyebrow="Wat er gebeurt">
              Lengte, vorm <em className="text-gold">en lijnen</em>
            </SectionTitle>
            <CheckList
              items={[
                'Trimmen op de lengte die bij je past, gelijkmatig over de hele baard.',
                'Shapen: een vorm die aansluit op je gezicht en je kapsel.',
                'Strakke contouren op de wangen en in de hals.',
                'Een volledige scheerbeurt met hot towel? Vraag ernaar bij je afspraak.',
              ]}
            />
          </div>
          <PriceCard ids={['baard', 'knippen-baard', 'late-knippen-baard']} />
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <PhotoStrip items={photosTagged('baard')} />
        </div>
      </section>

      <FaqSection page={page} title={<>Vragen over <em className="text-gold">je baard</em></>} />
      <CtaSection />
      <RelatedPages ids={['fade', 'prijzen', 'haircuts']} />
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
            Kinderkapper <em className="text-gold">in Almere Stad</em>
          </>
        }
        intro={
          <p>
            Bij Barber Iwan kunnen kinderen van 1 tot en met 12 jaar terecht voor een rustige, nette knipbeurt. Ouders noemen in hun reviews vooral hoe goed Iwan luistert en hoe kalm hij kleine kinderen krijgt.
          </p>
        }
        photo={photos.kid}
      />

      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <SectionTitle eyebrow="Prijzen">
            Prijzen voor <em className="text-gold">kinderen</em>
          </SectionTitle>
          <ul className="space-y-8">
            {servicesIn('kinderen').map((s) => (
              <li key={s.id} data-reveal>
                <div className="menu-row">
                  <span className="font-serif text-2xl md:text-3xl">{s.name}</span>
                  <span className="dots" aria-hidden="true" />
                  <span className="font-serif text-2xl md:text-3xl text-gold tabular-nums">{formatPrice(s.price)}</span>
                </div>
                <p className="text-white/50 text-sm mt-2">
                  {s.description} <span className="text-white/30">· {s.minutes} min</span>
                </p>
              </li>
            ))}
          </ul>
          <p className="text-white/55 mt-10">Wil je zelf ook geknipt worden? Boek dan aansluitend je eigen afspraak.</p>
          <div className="mt-8">
            <BookButton />
          </div>
        </div>
      </section>

      <ReviewsSection topic="kinderen" title={<>Wat <em className="text-gold">ouders</em> zeggen</>} />
      <FaqSection page={page} title={<>Vragen over <em className="text-gold">kinderen knippen</em></>} />
      <RelatedPages ids={['prijzen', 'haircuts', 'contact']} />
    </>
  );
}

const timeline = [
  { year: String(business.since), title: 'Het begin', text: 'Wat begon als een jongensdroom wordt een ambacht. Iwan begint in het kappersvak.' },
  { year: '2004', title: 'Barber Iwan', text: 'Bij de opening van Hairstudio Variaty in Almere gaat Iwan aan de slag onder de naam Barber Iwan.' },
  { year: '2010', title: 'Een uitstapje', text: 'Een paar jaar in de evenementenorganisatie. Het kappersvak bleef trekken.' },
  { year: 'Daarna', title: 'Terug in de stoel', text: 'Iwan keert terug als zelfstandig barber, en een groot deel van zijn vaste klanten komt mee terug.' },
  { year: 'Nu', title: 'Eigen salon', text: `Aan de ${business.address.street} in ${business.address.district}, ${business.address.area}.` },
];

export function About() {
  const page = pages.over;
  return (
    <>
      <PageHeader
        page={page}
        eyebrow="Over Iwan"
        title={
          <>
            Barber sinds <em className="text-gold">{business.since}</em>
          </>
        }
        intro={
          <p>
            Iwan knipt al ruim dertig jaar, en nog steeds met veel plezier. Elke klant kan een keurige, strakke knipbeurt verwachten, welk haartype je ook hebt.
          </p>
        }
      />

      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <SectionTitle eyebrow="Het verhaal">
            Van jongensdroom <em className="text-gold">tot eigen salon</em>
          </SectionTitle>
          <ol className="border-l border-white/10 ml-2 space-y-14">
            {timeline.map((t, i) => (
              <li key={t.title} className="relative pl-10" data-reveal style={d(i * 60)}>
                <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-gold" aria-hidden="true" />
                <p className="text-gold font-serif text-lg">{t.year}</p>
                <h3 className="font-serif text-3xl mt-1 mb-2">{t.title}</h3>
                <p className="text-white/60 leading-relaxed max-w-xl">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-24 bg-[#0a0a09]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid gap-16 lg:grid-cols-2 items-center">
          <figure data-reveal>
            <blockquote className="font-serif italic text-4xl md:text-5xl leading-tight">
              “Het knippen en scheren doe ik nog steeds met veel plezier.”
            </blockquote>
            <figcaption className="mt-6 text-white/45 text-sm tracking-[0.2em] uppercase">Iwan</figcaption>
          </figure>
          <div className="space-y-6 text-white/60 leading-relaxed text-lg" data-reveal style={d(100)}>
            <p>
              Iwan is gespecialiseerd in alle haarsoorten: Europees, Aziatisch, Black en Mixed hair. In de salon wordt hem ook vaak gevraagd om een figuur te scheren; dat kan bij elk haartype. Neem zelf een voorbeeld mee, of laat Iwan zijn fantasie gebruiken.
            </p>
            <p>Hij werkt uitsluitend op afspraak, zodat er voor ieder kapsel tijd en aandacht is.</p>
            <div className="pt-4 flex flex-wrap gap-x-10 gap-y-4">
              <ArrowLink href={pages.haircuts.path}>Bekijk zijn werk</ArrowLink>
              <ArrowLink href="/#afspraak">Plan een afspraak</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection />
      <RelatedPages ids={['haircuts', 'black-hair', 'contact']} />
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
            Contact <em className="text-gold">&amp; route</em>
          </>
        }
        intro={
          <p>
            Barber Iwan zit aan de {a.street} in {a.district}, {a.area}. Je bent welkom op afspraak, van dinsdag tot en met zaterdag tussen 09:00 en 17:00.
          </p>
        }
      />
      <section className="pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <ContactDetails />
            <div className="flex flex-wrap gap-4 mt-12">
              <BookButton />
            </div>
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-12 pt-10 border-t border-white/10 text-sm text-white/60">
              <li className="eyebrow">Volg</li>
              {[
                { href: business.instagram.url, label: 'Instagram' },
                { href: business.facebook, label: 'Facebook' },
                { href: business.treatwell, label: 'Treatwell' },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <MapEmbed />
        </div>
      </section>
      <FaqSection page={page} title={<>Route &amp; <em className="text-gold">parkeren</em></>} />
      <RelatedPages ids={['prijzen', 'haircuts', 'over']} />
    </>
  );
}

export function NotFound() {
  return (
    <section className="pt-48 pb-32">
      <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
        <Eyebrow>404</Eyebrow>
        <h1 className="font-serif text-5xl md:text-7xl mb-6">
          Deze pagina <em className="text-gold">bestaat niet</em>
        </h1>
        <p className="text-white/60 mb-12">Misschien is hij verhuisd. Hier vind je alles terug:</p>
        <ul className="flex flex-wrap justify-center gap-3">
          {(['home', 'prijzen', 'haircuts', 'contact'] as const).map((id) => (
            <li key={id}>
              <a href={pages[id].path} className="btn btn-ghost">
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
