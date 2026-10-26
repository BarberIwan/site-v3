import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, Calendar, Instagram, Phone } from 'lucide-react';
import { business, extra, formatPrice, instagram, openingForJsDay, reviewSummary, serviceById, work } from '../data';
import { pages } from '../pages';
import {
  BookingSection,
  ContactDetails,
  CtaSection,
  FaqSection,
  MapEmbed,
  ReviewsSection,
} from '../sections';
import { Logo, MagneticButton, MagneticLink, Picture, SectionLabel, Spotlight, TiltCard } from '../ui';
import { useNow } from '../useNow';

gsap.registerPlugin(ScrollTrigger);

const fullDays = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];

// Vandaag en morgen open of dicht. Zonder tijd (vooraf gerenderd) toont hij de
// vaste openingstijden; de dagstatus komt er in de browser bij.
function AvailabilityIndicator() {
  const now = useNow();

  if (!now) {
    return (
      <section className="py-20 relative overflow-hidden" aria-label="Openingstijden vandaag">
        <div className="relative max-w-5xl mx-auto px-8">
          <div className="border border-gold/30 bg-gradient-to-br from-[#0d0d0d] to-[#080808] p-8 md:p-12 text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-2">
              Vandaag nog <span className="italic text-gold">plek?</span>
            </h2>
            <p className="text-white/60 text-sm">Open dinsdag t/m zaterdag van 09:00 tot 17:00. Vrije tijden zie je direct in de agenda.</p>
          </div>
        </div>
      </section>
    );
  }

  const today = now.getDay();
  const tomorrow = (today + 1) % 7;
  const hour = now.getHours();
  const todayData = openingForJsDay(today);
  const tomorrowData = openingForJsDay(tomorrow);
  const isOpenNow = Boolean(todayData.opens) && hour >= 9 && hour < 17;
  const canBookToday = Boolean(todayData.opens) && hour < 17;

  const dayCard = (label: string, d: typeof todayData) => (
    <div className="border border-white/10 p-5 text-center hover:border-gold/40 transition-all bg-[#0a0a0a]">
      <div className="text-gold text-xs tracking-[0.2em] uppercase mb-2 font-sans">{label}</div>
      <div className={`font-serif text-xl md:text-2xl mb-1 ${d.opens ? 'text-green-400' : 'text-red-400'}`}>
        {d.opens ? 'Open' : 'Gesloten'}
      </div>
      <div className="mt-3 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="mt-3 text-gold text-xs">{d.opens ? `${d.opens} — ${d.closes}` : '—'}</div>
    </div>
  );

  return (
    <section className="py-20 relative overflow-hidden" aria-label="Openingstijden vandaag">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,74,0.06)_0%,_transparent_60%)]" />
      <div className="relative max-w-5xl mx-auto px-8">
        <div className="border border-gold/30 bg-gradient-to-br from-[#0d0d0d] to-[#080808] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 border border-gold/10 animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold" />

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                <div className={`w-3 h-3 rounded-full animate-pulse ${isOpenNow ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-xs tracking-[0.3em] uppercase font-sans ${isOpenNow ? 'text-green-500' : 'text-red-500'}`}>
                  {isOpenNow ? 'Nu open' : 'Nu gesloten'}
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl mb-2">
                Vandaag nog <span className="italic text-gold">plek?</span>
              </h2>
              <p className="text-white/60 text-sm">
                {todayData.opens
                  ? `Vandaag (${fullDays[today].toLowerCase()}) open van ${todayData.opens} tot ${todayData.closes}. Vrije tijden zie je direct in de agenda.`
                  : `Vandaag (${fullDays[today].toLowerCase()}) gesloten. Online boeken voor een andere dag kan altijd.`}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {dayCard(fullDays[today], todayData)}
              {dayCard(fullDays[tomorrow], tomorrowData)}
            </div>
          </div>

          <div className="mt-8 text-center">
            {canBookToday ? (
              <MagneticLink
                href="#afspraak"
                className="inline-flex items-center btn-cta animate-cta-pulse text-black font-sans text-xs tracking-[0.2em] uppercase px-10 py-5 rounded-sm"
              >
                <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                Bekijk vrije tijden
              </MagneticLink>
            ) : (
              <a
                href={business.phone.href}
                className="inline-flex items-center btn-cta animate-cta-pulse text-black font-sans text-xs tracking-[0.2em] uppercase px-10 py-5 rounded-sm"
              >
                <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                Bel voor een afspraak
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const specialties = [
  {
    title: 'Black & Mixed hair',
    text: 'Fades, tapers, strakke lijnen en geschoren figuren in afro-, kroes- en krullend haar.',
    href: pages['black-hair'].path,
  },
  {
    title: 'Fades & klassiek',
    text: 'Van skin fade tot klassieke herencoupe, bij steil, golvend en krullend haar.',
    href: pages.haircuts.path,
  },
  {
    title: 'Baard',
    text: 'Trimmen, shapen en strakke contouren, los of samen met je knipbeurt.',
    href: pages.prijzen.path,
  },
  {
    title: 'Kinderen',
    text: 'Een rustige knipbeurt voor kinderen van 1 tot en met 12 jaar.',
    href: pages.kinderen.path,
  },
];

export function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.to('.hero-bg', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
    });

    gsap.fromTo(
      '.about-image',
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: aboutRef.current, start: 'top 70%' } },
    );
    gsap.fromTo(
      '.about-content',
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2, scrollTrigger: { trigger: aboutRef.current, start: 'top 70%' } },
    );

    statsRef.current?.querySelectorAll('.stat-number').forEach((stat) => {
      const target = stat.getAttribute('data-target');
      if (target) {
        gsap.fromTo(
          stat,
          { innerText: 0 },
          { innerText: target, duration: 2, ease: 'power2.out', snap: { innerText: 1 }, scrollTrigger: { trigger: stat, start: 'top 80%' } },
        );
      }
    });

    gsap.fromTo(
      '.gallery-header',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: galleryRef.current, start: 'top 70%' } },
    );
    gsap.fromTo(
      '.contact-info',
      { x: -80, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: contactRef.current, start: 'top 70%' } },
    );
    gsap.fromTo(
      '.contact-map',
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2, scrollTrigger: { trigger: contactRef.current, start: 'top 70%' } },
    );

    gsap.utils.toArray<HTMLElement>('.line-reveal').forEach((line) => {
      gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power3.inOut', scrollTrigger: { trigger: line, start: 'top 85%' } });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % work.length), 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % work.length);
    setIsAutoPlaying(false);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + work.length) % work.length);
    setIsAutoPlaying(false);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <>
      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="min-h-screen relative flex items-center overflow-hidden">
        <div className="hero-bg absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/70 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/60 z-10" />
          <Picture photo={extra.hero} sizes="100vw" priority alt="" imgClassName="w-full h-full object-cover object-center opacity-50 scale-110" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,74,0.08)_0%,_transparent_60%)] z-10 animate-pulse" />
        </div>

        <div className="absolute top-1/4 right-20 w-px h-32 bg-gradient-to-b from-transparent via-gold/30 to-transparent animate-float hidden lg:block" />
        <div className="absolute bottom-1/3 left-20 w-px h-24 bg-gradient-to-b from-transparent via-gold/20 to-transparent animate-float hidden lg:block" style={{ animationDelay: '1s' }} />

        <div className="relative z-20 max-w-7xl mx-auto px-8 pt-32 pb-20 w-full">
          <div className="max-w-2xl">
            <div className="mb-10 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Logo className="h-48 md:h-56 w-auto" alt="Barber Iwan logo" />
            </div>

            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-8">
              <span className="flex items-center gap-4 mb-8 font-sans text-gold text-xs tracking-[0.3em] uppercase leading-normal">
                <span className="w-12 h-px bg-gold line-reveal origin-left" aria-hidden="true" />
                Barber & herenkapper in Almere
              </span>
              <span className="block overflow-hidden">
                <span className="block animate-slide-up">Vakmanschap</span>
              </span>
              <span className="block overflow-hidden">
                <span className="block italic text-gold animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  met karakter
                </span>
              </span>
            </h1>

            <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-lg mb-12 font-light">
              Sinds 1994 aan de schaar. Ervaren in Europees, Aziatisch, Black en Mixed hair: fades, baard en kinderkapsels in Tussen de Vaarten, op afspraak.
            </p>

            <div className="flex flex-wrap items-center gap-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <MagneticLink
                href="#afspraak"
                className="inline-flex items-center btn-cta btn-cta-ring animate-cta-pulse text-black font-sans text-sm tracking-[0.2em] uppercase px-12 py-7 rounded-sm"
              >
                <Calendar className="w-5 h-5 mr-3" aria-hidden="true" />
                Boek nu
              </MagneticLink>
              <a href="#werk" className="flex items-center gap-3 text-white/70 hover:text-gold transition-colors group" data-cursor-hover>
                <span className="text-xs tracking-[0.2em] uppercase">Bekijk werk</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 opacity-0 animate-fade-in hidden md:block" style={{ animationDelay: '0.6s' }} aria-hidden="true">
          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Scroll</span>
            <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="over" ref={aboutRef} className="py-32 relative overflow-hidden scroll-mt-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <TiltCard className="about-image relative">
              <div className="aspect-[4/5] img-zoom overflow-hidden border border-white/10">
                <Picture photo={extra.tools} sizes="(min-width: 1024px) 600px, 100vw" />
                <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-gold/50" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-gold/50" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full border border-gold/30 -z-10" />
            </TiltCard>

            <div className="about-content">
              <SectionLabel>Over mij</SectionLabel>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
                Ruim dertig jaar <br />
                <span className="italic text-gold">passie voor het vak</span>
              </h2>

              <div className="space-y-6 text-white/60 leading-relaxed font-light">
                <p>
                  Wat begon als een jongensdroom in 1994, groeide uit tot een levenslange missie: het perfectioneren van het ambacht van het barbierschap. Ik knip alle haartypes — Europees, Aziatisch, Black en Mixed hair — elk met zijn eigen eigenschappen en uitdagingen.
                </p>
                <p>
                  Bij Barber Iwan draait het niet alleen om een knipbeurt. Het is een moment van rust, persoonlijke aandacht en het vertrouwen dat je in goede handen bent. Van een strakke taper fade tot een geschoren figuur — elk kapsel wordt met precisie en zorg vormgegeven.
                </p>
              </div>

              <div ref={statsRef} className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/10">
                <Spotlight className="group p-4 -m-4">
                  <div className="font-serif text-4xl text-gold mb-1">
                    <span className="stat-number" data-target="30">30</span>+
                  </div>
                  <div className="text-xs tracking-[0.2em] uppercase text-white/40">Jaar ervaring</div>
                </Spotlight>
                <Spotlight className="group p-4 -m-4">
                  <div className="font-serif text-4xl text-gold mb-1">
                    <span className="stat-number" data-target="4">4</span>
                  </div>
                  <div className="text-xs tracking-[0.2em] uppercase text-white/40">Haartypes</div>
                </Spotlight>
                <Spotlight className="group p-4 -m-4">
                  <div className="font-serif text-4xl text-gold mb-1">{reviewSummary.rating}</div>
                  <div className="text-xs tracking-[0.2em] uppercase text-white/40">Op Treatwell</div>
                </Spotlight>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialisaties en prijzen */}
      <section id="behandelingen" className="py-32 relative bg-[#0a0a0a] overflow-hidden scroll-mt-24">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <SectionLabel center>Behandelingen</SectionLabel>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
              Wat ik <span className="italic text-gold">voor je doe</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {specialties.map((s) => (
              <a key={s.title} href={s.href} className="group border border-white/10 p-8 hover:border-gold/40 transition-colors flex flex-col" data-cursor-hover>
                <h3 className="font-serif text-2xl mb-3">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed flex-1">{s.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-gold text-xs tracking-[0.2em] uppercase">
                  Meer weten
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <h3 className="font-serif text-3xl md:text-4xl mb-6 text-center">Prijzen</h3>
            <ul className="border-t border-white/10">
              {['knippen', 'knippen-baard', 'baard', 'kids-5-12', 'kids-1-4'].map((id) => {
                const s = serviceById(id);
                return (
                  <li key={id} className="flex items-baseline justify-between gap-6 py-4 border-b border-white/10">
                    <span className="text-white/80">
                      {s.name} <span className="text-white/30 text-xs ml-2">{s.minutes} min</span>
                    </span>
                    <span className="font-serif text-2xl text-gold">{formatPrice(s.price)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="text-center mt-8">
              <a href={pages.prijzen.path} className="inline-flex items-center gap-3 text-gold hover:text-white transition-colors text-xs tracking-[0.2em] uppercase">
                Alle behandelingen en prijzen
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Carousel Section */}
      <section id="werk" ref={galleryRef} className="py-32 relative overflow-hidden scroll-mt-24">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-8">
          <div className="gallery-header text-center mb-16">
            <SectionLabel center>Mijn werk</SectionLabel>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
              Uit de <span className="italic text-gold">stoel</span>
            </h2>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden" aria-roledescription="carrousel" aria-label="Haircuts van Barber Iwan">
              <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {work.map((image, index) => (
                  <div
                    key={image.file}
                    className="w-full flex-shrink-0 px-4"
                    role="group"
                    aria-roledescription="dia"
                    aria-label={`${index + 1} van ${work.length}`}
                    aria-hidden={index !== currentSlide}
                  >
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <TiltCard className="relative aspect-[3/4] overflow-hidden border border-white/10">
                        <Picture photo={image} sizes="(min-width: 768px) 600px, 100vw" imgClassName="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-gold/50" />
                        <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-gold/50" />
                      </TiltCard>
                      <div className="text-center md:text-left py-8">
                        <div className="text-gold/60 text-sm tracking-[0.3em] uppercase font-sans mb-4">
                          0{index + 1} / 0{work.length}
                        </div>
                        <h3 className="font-serif text-4xl md:text-5xl mb-4">{image.title}</h3>
                        <p className="text-white/60 text-lg mb-8">{image.caption}</p>
                        <div className="w-16 h-px bg-gold mx-auto md:mx-0 line-reveal origin-left" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <MagneticButton
                onClick={prevSlide}
                label="Vorige foto"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 border border-white/20 flex items-center justify-center hover:border-gold hover:bg-gold/10 transition-all group"
              >
                <ArrowLeft className="w-5 h-5 text-white/60 group-hover:text-gold transition-colors" aria-hidden="true" />
              </MagneticButton>
              <MagneticButton
                onClick={nextSlide}
                label="Volgende foto"
                className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 border border-white/20 flex items-center justify-center hover:border-gold hover:bg-gold/10 transition-all group"
              >
                <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-gold transition-colors" aria-hidden="true" />
              </MagneticButton>
            </div>

            <div className="flex justify-center gap-3 mt-12">
              {work.map((image, index) => (
                <button
                  type="button"
                  key={image.file}
                  onClick={() => goToSlide(index)}
                  aria-label={`Toon foto ${index + 1}: ${image.title}`}
                  aria-current={currentSlide === index}
                  className={`transition-all duration-300 ${currentSlide === index ? 'w-8 h-1 bg-gold' : 'w-1 h-1 bg-white/30 hover:bg-white/50'}`}
                  data-cursor-hover
                />
              ))}
            </div>

            <div className="mt-8 h-px bg-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-gold transition-all duration-500" style={{ width: `${((currentSlide + 1) / work.length) * 100}%` }} />
            </div>

            <div className="text-center mt-12">
              <a href={pages.haircuts.path} className="inline-flex items-center gap-3 border border-white/20 px-8 py-4 text-white/70 hover:text-gold hover:border-gold/50 transition-all font-sans text-xs tracking-[0.2em] uppercase">
                Bekijk alle haircuts
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <BookingSection />

      <AvailabilityIndicator />

      {/* Instagram Feed Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#080808] to-[#0a0a0a]" />
        <div className="relative max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <SectionLabel center>Instagram</SectionLabel>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
              Volg <span className="italic text-gold">{business.instagram.handle}</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">Inspiratie, behind-the-scenes en de nieuwste creaties.</p>
            <a
              href={business.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-gold hover:text-white transition-colors group"
              data-cursor-hover
            >
              <Instagram className="w-5 h-5" aria-hidden="true" />
              <span className="text-xs tracking-[0.2em] uppercase">{business.instagram.handle}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" aria-hidden="true" />
            </a>
          </div>

          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {instagram.map((image) => (
              <li key={image.file}>
                <a
                  href={business.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-square overflow-hidden border border-white/10 hover:border-gold/50 transition-all group img-zoom"
                  data-cursor-hover
                >
                  <Picture photo={image} sizes="(min-width: 1024px) 200px, (min-width: 768px) 33vw, 50vw" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" aria-hidden="true" />
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqSection page={pages.home} />

      <ReviewsSection />

      {/* Quote Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,74,0.03)_0%,_transparent_60%)]" />
        <figure className="max-w-4xl mx-auto px-8 text-center relative">
          <blockquote className="font-serif text-4xl md:text-5xl lg:text-6xl italic leading-tight mb-8">
            <span className="text-gold text-6xl opacity-30 absolute -top-8 -left-4" aria-hidden="true">"</span>
            Een goede barber begrijpt niet alleen haar,
            <span className="text-gold"> maar de persoon erachter</span>.
            <span className="text-gold text-6xl opacity-30 absolute -bottom-8 -right-4" aria-hidden="true">"</span>
          </blockquote>
          <figcaption className="flex items-center justify-center gap-4 mt-8">
            <span className="w-12 h-px bg-gold line-reveal origin-right" aria-hidden="true" />
            <span className="text-white/40 text-xs tracking-[0.3em] uppercase font-sans">Barber Iwan</span>
            <span className="w-12 h-px bg-gold line-reveal origin-left" aria-hidden="true" />
          </figcaption>
        </figure>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="py-32 relative bg-[#0a0a0a] overflow-hidden scroll-mt-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="contact-info">
              <SectionLabel>Contact</SectionLabel>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-12">
                Kom langs in <br />
                <span className="italic text-gold">Almere</span>
              </h2>
              <ContactDetails />
              <a href={pages.contact.path} className="inline-flex items-center gap-3 mt-12 text-white/60 hover:text-gold transition-colors text-xs tracking-[0.2em] uppercase">
                Route, parkeren en contact
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
            <MapEmbed />
          </div>
        </div>
      </section>

      <CtaSection href="#afspraak" />
    </>
  );
}
