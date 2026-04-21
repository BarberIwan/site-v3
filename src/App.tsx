import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Instagram, Calendar, ArrowRight, ArrowLeft, Menu, X, ChevronDown, HelpCircle, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const openingHours = [
  { day: 'Ma', hours: 'Gesloten' },
  { day: 'Di', hours: '09:00 — 17:00' },
  { day: 'Wo', hours: '09:00 — 17:00' },
  { day: 'Do', hours: '09:00 — 17:00' },
  { day: 'Vr', hours: '09:00 — 17:00' },
  { day: 'Za', hours: '09:00 — 17:00' },
  { day: 'Zo', hours: 'Gesloten' },
];

const carouselImages = [
  { src: '/7BA86E7C-5624-4FB8-B92B-ED7F1729ACC7.jpg', title: 'Fade Masterpiece', desc: 'Strakke fade met perfecte overgang' },
  { src: '/ECE8A51A-C1C4-4D31-9604-795D3E8BC503.jpg', title: 'Classic Taper', desc: 'Tijdloze elegantie' },
  { src: '/C61F0EF9-D76E-4DD4-AA20-F9F5ADF5E800.jpg', title: 'Precision Cut', desc: 'Vakmanschap in elk detail' },
  { src: '/7367F35C-CC28-43C5-A6F7-E786E6FD6D31.jpg', title: 'Modern Style', desc: 'Trendy en verzorgd' },
  { src: '/9AA8A269-A960-4E8A-B7B7-22A7C1038927.jpg', title: 'Clean Lines', desc: 'Strakke lijnen, perfecte finish' },
  { src: '/CF0D0669-07E7-485C-8260-C9BED93B82F8.jpg', title: 'Signature Look', desc: 'Unieke stijl, persoonlijke touch' },
  { src: '/2D8D9132-0A24-4FA7-B8A7-3D3A91395F3F.jpg', title: 'Fresh Cut', desc: 'Polished en professioneel' },
];

// Custom Cursor Component
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: 'power2.out',
      });
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.02,
        ease: 'none',
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', moveCursor);

    // Add hover detection for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className={`custom-cursor ${isHovering ? 'hover' : ''}`}
        style={{ left: 0, top: 0 }}
      />
      <div ref={dotRef} className="custom-cursor-dot" style={{ left: 0, top: 0 }} />
    </>
  );
}

// FAQ Item Component
function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (answerRef.current) {
      if (isOpen) {
        gsap.to(answerRef.current, {
          height: 'auto',
          opacity: 1,
          duration: 0.4,
          ease: 'power3.out',
        });
      } else {
        gsap.to(answerRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power3.inOut',
        });
      }
    }
  }, [isOpen]);

  return (
    <div
      className={`border transition-all ${
        isOpen ? 'border-gold/40 bg-[#080808]' : 'border-white/10 bg-[#0a0a0a]'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left group"
        data-cursor-hover
      >
        <div className="flex items-center gap-4">
          <span className="text-gold/40 font-serif text-sm">{String(index + 1).padStart(2, '0')}</span>
          <span className={`font-sans text-sm tracking-wide transition-colors ${
            isOpen ? 'text-gold' : 'text-white/80 group-hover:text-white'
          }`}>
            {question}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gold flex-shrink-0 ml-4 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div ref={answerRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div className="px-6 pb-6 pl-16">
          <p className="text-white/50 text-sm leading-relaxed font-sans">{answer}</p>
        </div>
      </div>
    </div>
  );
}

// Loading Screen Component
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete,
        });
      },
    });

    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
    )
      .fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, ease: 'power2.inOut' },
        '-=0.3'
      )
      .fromTo(
        textRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 },
        '-=1'
      )
      .to({}, { duration: 0.5 });
  }, [onComplete]);

  return (
    <div ref={containerRef} className="loading-screen">
      <img ref={logoRef} src="/logo.png" alt="Barber Iwan" className="h-32 w-auto opacity-0" />
      <div className="loading-bar">
        <div ref={barRef} className="loading-bar-fill" style={{ transform: 'scaleX(0)' }} />
      </div>
      <div ref={textRef} className="mt-4 text-xs tracking-[0.3em] uppercase text-white/40 opacity-0">
        Laden...
      </div>
    </div>
  );
}

// Magnetic Button Component
function MagneticButton({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(button, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`magnetic ${className}`}
      data-cursor-hover
    >
      {children}
    </button>
  );
}

// Tilt Card Component
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 10,
      rotateX: -y * 10,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
      data-cursor-hover
    >
      {children}
    </div>
  );
}

// Spotlight Component
function Spotlight({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    container.style.setProperty('--spotlight-x', `${x}px`);
    container.style.setProperty('--spotlight-y', `${y}px`);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`spotlight ${className}`}
      style={{
        '--spotlight-x': '50%',
        '--spotlight-y': '50%',
      } as React.CSSProperties}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(600px circle at var(--spotlight-x) var(--spotlight-y), rgba(201, 168, 74, 0.06), transparent 40%)',
        }}
      />
      {children}
    </div>
  );
}

// Availability Indicator Component - Dynamic based on current day
function AvailabilityIndicator({ scrollTo }: { scrollTo: (id: string) => void }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fullDays = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
  
  const today = currentTime.getDay();
  const tomorrow = (today + 1) % 7;
  const currentHour = currentTime.getHours();

  // Opening hours
  const openingHours: Record<number, { open: boolean; hours: string }> = {
    0: { open: false, hours: 'Gesloten' }, // Sunday
    1: { open: false, hours: 'Gesloten' }, // Monday
    2: { open: true, hours: '09:00 — 17:00' }, // Tuesday
    3: { open: true, hours: '09:00 — 17:00' }, // Wednesday
    4: { open: true, hours: '09:00 — 17:00' }, // Thursday
    5: { open: true, hours: '09:00 — 17:00' }, // Friday
    6: { open: true, hours: '09:00 — 17:00' }, // Saturday
  };

  const todayData = openingHours[today];
  const tomorrowData = openingHours[tomorrow];

  // Determine today's availability status
  const getTodayStatus = () => {
    if (!todayData.open) {
      return { status: 'Gesloten', subtext: 'Morgen open', color: 'text-red-400', action: 'Bel voor morgen' };
    }
    
    // If it's past 16:00, limited spots left
    if (currentHour >= 16) {
      return { status: 'Sluit snel', subtext: 'Bel nu', color: 'text-orange-400', action: 'Bel Nu' };
    }
    
    // If it's past 12:00, afternoon slots available
    if (currentHour >= 12) {
      return { status: 'Nog plek', subtext: 'Middag vrij', color: 'text-green-400', action: 'Direct Boeken' };
    }
    
    // Morning - fully available
    return { status: 'Beschikbaar', subtext: 'Hele dag', color: 'text-green-400', action: 'Direct Boeken' };
  };

  // Determine tomorrow's availability
  const getTomorrowStatus = () => {
    if (!tomorrowData.open) {
      return { status: 'Gesloten', subtext: fullDays[tomorrow], color: 'text-red-400' };
    }
    return { status: 'Beschikbaar', subtext: '09:00 - 17:00', color: 'text-green-400' };
  };

  const todayStatus = getTodayStatus();
  const tomorrowStatus = getTomorrowStatus();

  // Check if shop is currently open
  const isCurrentlyOpen = todayData.open && currentHour >= 9 && currentHour < 17;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,74,0.06)_0%,_transparent_60%)]" />
      <div className="relative max-w-5xl mx-auto px-8">
        <div className="border border-gold/30 bg-gradient-to-br from-[#0d0d0d] to-[#080808] p-8 md:p-12 relative overflow-hidden">
          {/* Animated border glow */}
          <div className="absolute inset-0 border border-gold/10 animate-pulse" style={{ animationDuration: '3s' }} />
          
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold" />

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left - Status */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                <div className={`w-3 h-3 rounded-full animate-pulse ${isCurrentlyOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-xs tracking-[0.3em] uppercase font-sans ${isCurrentlyOpen ? 'text-green-500' : 'text-red-500'}`}>
                  {isCurrentlyOpen ? 'Nu Open' : 'Gesloten'}
                </span>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl mb-2">
                Vandaag Nog <span className="italic text-gold">Plek?</span>
              </h3>
              <p className="text-white/60 text-sm">
                {todayData.open 
                  ? `Vandaag (${fullDays[today]}) open van ${todayData.hours}.` 
                  : `Vandaag (${fullDays[today]}) gesloten. Morgen weer open!`}
              </p>
            </div>

            {/* Right - Availability Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Today */}
              <div className="border border-white/10 p-5 text-center hover:border-gold/40 transition-all group bg-[#0a0a0a]">
                <div className="text-gold text-xs tracking-[0.2em] uppercase mb-2 font-sans">{fullDays[today]}</div>
                <div className={`font-serif text-xl md:text-2xl mb-1 ${todayStatus.color}`}>{todayStatus.status}</div>
                <div className="text-white/40 text-xs">{todayStatus.subtext}</div>
                <div className="mt-3 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                <div className="mt-3 text-gold text-xs">{todayData.hours}</div>
              </div>

              {/* Tomorrow */}
              <div className="border border-white/10 p-5 text-center hover:border-gold/40 transition-all group bg-[#0a0a0a]">
                <div className="text-gold text-xs tracking-[0.2em] uppercase mb-2 font-sans">{fullDays[tomorrow]}</div>
                <div className={`font-serif text-xl md:text-2xl mb-1 ${tomorrowStatus.color}`}>{tomorrowStatus.status}</div>
                <div className="text-white/40 text-xs">{tomorrowStatus.subtext}</div>
                <div className="mt-3 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                <div className="mt-3 text-gold text-xs">{tomorrowData.hours}</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            {todayData.open && currentHour < 17 ? (
              <MagneticButton
                onClick={() => scrollTo('booking')}
                className="btn-cta animate-cta-pulse text-black font-sans text-xs tracking-[0.2em] uppercase px-10 py-5 rounded-sm"
              >
                <Calendar className="w-4 h-4 mr-2 inline" />
                {todayStatus.action}
              </MagneticButton>
            ) : (
              <a
                href="tel:0627403607"
                className="inline-flex items-center btn-cta animate-cta-pulse text-black font-sans text-xs tracking-[0.2em] uppercase px-10 py-5 rounded-sm"
              >
                <Phone className="w-4 h-4 mr-2 inline" />
                Bel voor Afspraak
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Loading complete handler
  const handleLoadingComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (!isLoaded) return;

    // Hero parallax
    gsap.to('.hero-bg', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // About section reveal
    gsap.fromTo(
      '.about-image',
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top 70%',
        },
      }
    );

    gsap.fromTo(
      '.about-content',
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2,
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top 70%',
        },
      }
    );

    // Stats counter animation
    const statNumbers = statsRef.current?.querySelectorAll('.stat-number');
    statNumbers?.forEach((stat) => {
      const target = stat.getAttribute('data-target');
      if (target) {
        gsap.fromTo(
          stat,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2,
            ease: 'power2.out',
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: stat,
              start: 'top 80%',
            },
          }
        );
      }
    });

    // Gallery section
    gsap.fromTo(
      '.gallery-header',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 70%',
        },
      }
    );

    // Booking section
    gsap.fromTo(
      '.booking-frame',
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bookingRef.current,
          start: 'top 70%',
        },
      }
    );

    // Contact section
    gsap.fromTo(
      '.contact-info',
      { x: -80, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contactRef.current,
          start: 'top 70%',
        },
      }
    );

    gsap.fromTo(
      '.contact-map',
      { x: 80, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2,
        scrollTrigger: {
          trigger: contactRef.current,
          start: 'top 70%',
        },
      }
    );

    // Line animations
    gsap.utils.toArray<HTMLElement>('.line-reveal').forEach((line) => {
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: line,
            start: 'top 85%',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isLoaded]);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: element, offsetY: 80 },
        ease: 'power3.inOut',
      });
    }
    setMenuOpen(false);
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    setIsAutoPlaying(false);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    setIsAutoPlaying(false);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  if (!isLoaded) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white grain">
      <CustomCursor />

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 100 ? 'bg-[#080808]/95 backdrop-blur-md py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <MagneticButton onClick={() => scrollTo('hero')} className="flex items-center gap-3">
            <img src="/logo.png" alt="Barber Iwan - Herenkapper Almere Logo" className="h-24 w-auto" />
          </MagneticButton>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-12">
            {['Over', 'Gallery', 'Agenda', 'Contact'].map((item) => (
              <MagneticButton
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className={`link-underline text-sm tracking-widest uppercase transition-colors ${
                  item === 'Agenda' ? 'text-gold hover:text-gold/80' : 'text-white/70 hover:text-white'
                }`}
              >
                {item}
              </MagneticButton>
            ))}
          </div>

          <MagneticButton
            onClick={() => scrollTo('booking')}
            className="hidden md:block btn-cta animate-cta-pulse text-black font-sans text-xs tracking-widest uppercase px-8 py-5 rounded-sm"
          >
            <Calendar className="w-4 h-4 mr-2 inline" />
            Boek Nu
          </MagneticButton>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} data-cursor-hover>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#080808] border-t border-white/10 py-8 px-8">
            <div className="flex flex-col gap-6">
              {['Over', 'Gallery', 'Agenda', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase())}
                  className={`text-left text-lg tracking-widest uppercase ${
                    item === 'Agenda' ? 'text-gold' : ''
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="min-h-screen relative flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="hero-bg absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/70 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/60 z-10" />
          <img
            src="/hero-barber.jpg"
            alt="Barber Iwan - Professionele herenkapper in Almere met 30 jaar ervaring"
            className="w-full h-full object-cover object-center opacity-50 scale-110"
          />
          {/* Animated overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,74,0.08)_0%,_transparent_60%)] z-10 animate-pulse" />
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 right-20 w-px h-32 bg-gradient-to-b from-transparent via-gold/30 to-transparent animate-float hidden lg:block" />
        <div className="absolute bottom-1/3 left-20 w-px h-24 bg-gradient-to-b from-transparent via-gold/20 to-transparent animate-float hidden lg:block" style={{ animationDelay: '1s' }} />

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-8 pt-32 pb-20 w-full">
          <div className="max-w-2xl">
            {/* Logo in Hero */}
            <div className="mb-10 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              <img src="/logo.png" alt="Barber Iwan Logo - Herenkapper Almere" className="h-48 md:h-56 w-auto" />
            </div>

            {/* Tagline */}
            <div className="flex items-center gap-4 mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <div className="w-12 h-px bg-gold line-reveal origin-left" />
              <span className="text-gold text-xs tracking-[0.3em] uppercase font-sans">Almere • Sinds 1994</span>
            </div>

            {/* Main Title with character animation */}
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-8">
              <span className="block overflow-hidden">
                <span className="block opacity-0 animate-slide-up" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
                  Vakmanschap
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="block italic text-gold opacity-0 animate-slide-up" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
                  met karakter
                </span>
              </span>
            </h1>

            {/* Description */}
            <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-lg mb-12 font-light opacity-0 animate-fade-in" style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
              Drie decennia ervaring in Europees, Aziatisch en Black hair. Waar precisie persoonlijke aandacht ontmoet.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-6 opacity-0 animate-fade-in" style={{ animationDelay: '1.3s', animationFillMode: 'forwards' }}>
              <MagneticButton
                onClick={() => scrollTo('booking')}
                className="btn-cta btn-cta-ring animate-cta-pulse text-black font-sans text-sm tracking-[0.2em] uppercase px-12 py-7 rounded-sm"
              >
                <Calendar className="w-5 h-5 mr-3 inline" />
                Boek Nu
              </MagneticButton>
              <button
                onClick={() => scrollTo('gallery')}
                className="flex items-center gap-3 text-white/70 hover:text-gold transition-colors group"
                data-cursor-hover
              >
                <span className="text-xs tracking-[0.2em] uppercase">Bekijk Werk</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 opacity-0 animate-fade-in" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Scroll</span>
            <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="over" ref={aboutRef} className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Image */}
            <TiltCard className="about-image relative">
              <div className="aspect-[4/5] img-zoom overflow-hidden border border-white/10">
                <img src="/tools-flatlay.jpg" alt="Professionele barber tools bij Barber Iwan Almere - Schaar, kam en scheermes" className="w-full h-full object-cover" />
                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-gold/50" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-gold/50" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full border border-gold/30 -z-10" />
            </TiltCard>

            {/* Content */}
            <div className="about-content">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-px bg-gold line-reveal origin-left" />
                <span className="text-gold text-xs tracking-[0.3em] uppercase font-sans">Over Mij</span>
              </div>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
                Dertig jaar <br />
                <span className="italic text-gold">passie voor het vak</span>
              </h2>

              <div className="space-y-6 text-white/60 leading-relaxed font-light">
                <p>
                  Wat begon als een jongensdroom in 1994, groeide uit tot een levenslange missie: het perfectioneren van het ambacht van het barbierschap. Ik ben gespecialiseerd in drie haartypes — Europees, Aziatisch en Black hair — elk met zijn eigen unieke eigenschappen en uitdagingen.
                </p>
                <p>
                  Bij Barber Iwan draait het niet alleen om een knipbeurt. Het is een moment van rust, persoonlijke aandacht en het vertrouwen dat je in goede handen bent. Van een strakke taper fade tot een gedurfde mullet — elk kapsel wordt met precisie en zorg vormgegeven.
                </p>
              </div>

              {/* Stats */}
              <div ref={statsRef} className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/10">
                <Spotlight className="group p-4 -m-4">
                  <div className="stat-number font-serif text-4xl text-gold mb-1" data-target="30">
                    0
                  </div>
                  <div className="text-xs tracking-[0.2em] uppercase text-white/40">Jaar ervaring</div>
                </Spotlight>
                <Spotlight className="group p-4 -m-4">
                  <div className="stat-number font-serif text-4xl text-gold mb-1" data-target="3">
                    0
                  </div>
                  <div className="text-xs tracking-[0.2em] uppercase text-white/40">Specialisaties</div>
                </Spotlight>
                <Spotlight className="group p-4 -m-4">
                  <div className="font-serif text-4xl text-gold mb-1">∞</div>
                  <div className="text-xs tracking-[0.2em] uppercase text-white/40">Passie</div>
                </Spotlight>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Carousel Section */}
      <section id="gallery" ref={galleryRef} className="py-32 relative bg-[#0a0a0a] overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-8">
          {/* Header */}
          <div className="gallery-header text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-8 h-px bg-gold line-reveal origin-center" />
              <span className="text-gold text-xs tracking-[0.3em] uppercase font-sans">Mijn Werk</span>
              <div className="w-8 h-px bg-gold line-reveal origin-center" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
              Mijn <span className="italic text-gold">Creaties</span>
            </h2>
          </div>

          {/* Luxury Carousel */}
          <div className="relative">
            {/* Main Carousel Container */}
            <div className="relative overflow-hidden">
              {/* Slides */}
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselImages.map((image, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      {/* Image with Tilt effect */}
                      <TiltCard className="relative aspect-[3/4] overflow-hidden border border-white/10">
                        <img
                          src={image.src}
                          alt={`${image.title} - ${image.desc} door Barber Iwan Almere`}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          loading="lazy"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        {/* Corner accents */}
                        <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-gold/50" />
                        <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-gold/50" />
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                      </TiltCard>

                      {/* Content */}
                      <div className="text-center md:text-left py-8">
                        <div className="text-gold/60 text-sm tracking-[0.3em] uppercase font-sans mb-4">
                          0{index + 1} / 0{carouselImages.length}
                        </div>
                        <h3 className="font-serif text-4xl md:text-5xl mb-4">{image.title}</h3>
                        <p className="text-white/60 text-lg mb-8">{image.desc}</p>
                        <div className="w-16 h-px bg-gold mx-auto md:mx-0 line-reveal origin-left" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <MagneticButton
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 border border-white/20 flex items-center justify-center hover:border-gold hover:bg-gold/10 transition-all group"
              >
                <ArrowLeft className="w-5 h-5 text-white/60 group-hover:text-gold transition-colors" />
              </MagneticButton>
              <MagneticButton
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 border border-white/20 flex items-center justify-center hover:border-gold hover:bg-gold/10 transition-all group"
              >
                <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-gold transition-colors" />
              </MagneticButton>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-3 mt-12">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 ${
                    currentSlide === index ? 'w-8 h-1 bg-gold' : 'w-1 h-1 bg-white/30 hover:bg-white/50'
                  }`}
                  data-cursor-hover
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-8 h-px bg-white/10 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gold transition-all duration-500"
                style={{ width: `${((currentSlide + 1) / carouselImages.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section - Salonized Agenda */}
      <section id="booking" ref={bookingRef} className="py-32 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#080808] to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,74,0.05)_0%,_transparent_60%)]" />

        <div className="relative max-w-6xl mx-auto px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-8 h-px bg-gold line-reveal origin-center" />
              <span className="text-gold text-xs tracking-[0.3em] uppercase font-sans">Online Agenda</span>
              <div className="w-8 h-px bg-gold line-reveal origin-center" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
              Boek je <span className="italic text-gold">Afspraak</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">Kies je behandeling en gewenste tijd. Direct bevestigd, geen gedoe.</p>
          </div>

          {/* Salonized Widget */}
          <div className="booking-frame relative">
            {/* Decorative frame */}
            <div className="relative border border-white/10 bg-[#0d0d0d]">
              {/* Animated corner accents */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold/50 -mt-px -ml-px animate-pulse" style={{ animationDuration: '3s' }} />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-gold/50 -mt-px -mr-px animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-gold/50 -mb-px -ml-px animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }} />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold/50 -mb-px -mr-px animate-pulse" style={{ animationDuration: '3s', animationDelay: '1.5s' }} />

              {/* Iframe */}
              <div className="p-2 md:p-4">
                <iframe
                  src="https://barber-iwan-1.salonized.com/widget_bookings/new"
                  width="100%"
                  height="700"
                  style={{ border: 'none', background: 'transparent' }}
                  title="Barber Iwan Online Agenda"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              { icon: Calendar, title: 'Direct Bevestigd', desc: 'Geen wachttijd, direct zekerheid' },
              { icon: Clock, title: '24/7 Beschikbaar', desc: 'Boek wanneer het jou uitkomt' },
              { icon: Phone, title: 'Liever Bellen?', desc: '06 — 27 40 36 07' },
            ].map((item, index) => (
              <TiltCard key={index} className="text-center p-6 border border-white/10 hover:border-gold/30 transition-colors group">
                <div className="text-gold text-3xl mb-3 group-hover:scale-110 transition-transform">
                  <item.icon className="w-8 h-8 mx-auto" />
                </div>
                <h4 className="font-serif text-xl mb-2">{item.title}</h4>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Availability Indicator - Dynamic */}
      <AvailabilityIndicator scrollTo={scrollTo} />

      {/* Instagram Feed Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#080808] to-[#0a0a0a]" />
        
        <div className="relative max-w-7xl mx-auto px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-8 h-px bg-gold line-reveal origin-center" />
              <span className="text-gold text-xs tracking-[0.3em] uppercase font-sans">Instagram</span>
              <div className="w-8 h-px bg-gold line-reveal origin-center" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
              Volg <span className="italic text-gold">@barberiwan</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              Dagelijkse inspiratie, behind-the-scenes en de nieuwste creaties. Volg me voor meer.
            </p>
            <a
              href="https://www.instagram.com/barberiwan/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-gold hover:text-white transition-colors group"
              data-cursor-hover
            >
              <Instagram className="w-5 h-5" />
              <span className="text-xs tracking-[0.2em] uppercase">@barberiwan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </a>
          </div>

          {/* Instagram Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { src: '/ig-1.jpg', title: 'Barber Iwan', desc: 'Instagram' },
              { src: '/ig-2.jpg', title: 'Barber Iwan', desc: 'Instagram' },
              { src: '/ig-3.jpg', title: 'Barber Iwan', desc: 'Instagram' },
              { src: '/ig-4.jpg', title: 'Barber Iwan', desc: 'Instagram' },
              { src: '/ig-5.jpg', title: 'Barber Iwan', desc: 'Instagram' },
              { src: '/ig-6.jpg', title: 'Barber Iwan', desc: 'Instagram' },
            ].map((image, index) => (
              <a
                key={index}
                href="https://www.instagram.com/barberiwan/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square overflow-hidden border border-white/10 hover:border-gold/50 transition-all group img-zoom"
                data-cursor-hover
              >
                <img
                  src={image.src}
                  alt={`${image.title} - ${image.desc} | Barber Iwan Instagram`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" />
                </div>
                {/* Corner accent */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-gold/0 group-hover:border-gold/60 transition-all duration-300" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-gold/0 group-hover:border-gold/60 transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
            {[
              { number: '2.5K+', label: 'Volgers' },
              { number: '500+', label: 'Posts' },
              { number: '50+', label: 'Reviews' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-serif text-3xl text-gold mb-1">{stat.number}</div>
                <div className="text-white/40 text-xs tracking-[0.2em] uppercase font-sans">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#080808] to-[#0a0a0a]" />
        
        <div className="relative max-w-4xl mx-auto px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-8 h-px bg-gold line-reveal origin-center" />
              <span className="text-gold text-xs tracking-[0.3em] uppercase font-sans">FAQ</span>
              <div className="w-8 h-px bg-gold line-reveal origin-center" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
              Veelgestelde <span className="italic text-gold">Vragen</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Antwoorden op de meest gestelde vragen. Staat je vraag er niet tussen? Neem gerust contact op.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {[
              {
                q: 'Hoelang van tevoren moet ik een afspraak maken?',
                a: 'Je kunt tot 24 uur van tevoren online een afspraak maken. Voor kortere termijnen bel je het beste even, dan kijk ik wat er mogelijk is.'
              },
              {
                q: 'Kan ik zonder afspraak langskomen?',
                a: 'Ik werk uitsluitend op afspraak. Dit garandeert dat ik de tijd en aandacht kan geven die elk kapsel verdient. Online boeken is zo gedaan!'
              },
              {
                q: 'Hoe lang duurt een gemiddelde knipbeurt?',
                a: 'Een standaard knipbeurt duurt 30-45 minuten. Vingertips: 20 min. Een uitgebreide behandeling met wassen en stylen duurt 45-60 minuten.'
              },
              {
                q: 'Heb je ervaring met krullend en kroeshaar?',
                a: 'Absoluut. Met meer dan 30 jaar ervaring ben ik gespecialiseerd in alle haartypes, inclusief Europees, Aziatisch en Black hair. Elke textuur vraagt een eigen aanpak.'
              },
              {
                q: 'Kan ik ook terecht voor mijn baard?',
                a: 'Ja, ik verzorg ook baarden. Van een nette trim tot een volledige scheerbeurt met hot towel. Vraag ernaar bij je afspraak.'
              },
              {
                q: 'Wat is je annuleringsbeleid?',
                a: 'Je kunt tot 24 uur van tevoren kosteloos annuleren. Bij no-shows of te late annulering kan een vergoeding in rekening worden gebracht.'
              },
              {
                q: 'Kan ik pinnen of moet ik contant betalen?',
                a: 'Je kunt zowel pinnen als contant betalen. Ook Tikkie is mogelijk. Gemakkelijk en snel!'
              },
              {
                q: 'Waar kan ik parkeren?',
                a: 'Er is gratis parkeergelegenheid in de buurt van de salon. De exacte locatie ontvang je bij je boekingsbevestiging.'
              },
            ].map((item, index) => (
              <FAQItem key={index} question={item.q} answer={item.a} index={index} />
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center border border-white/10 p-8 bg-[#080808]">
            <HelpCircle className="w-8 h-8 text-gold mx-auto mb-4" />
            <p className="text-white/60 mb-2">Nog een vraag?</p>
            <p className="text-white/40 text-sm mb-4">Bel of app me gerust</p>
            <a
              href="tel:0627403607"
              className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors font-sans text-xs tracking-[0.2em] uppercase"
              data-cursor-hover
            >
              <Phone className="w-4 h-4" />
              06 — 27 40 36 07
            </a>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,74,0.06)_0%,_transparent_60%)]" />
        
        <div className="relative max-w-7xl mx-auto px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-8 h-px bg-gold line-reveal origin-center" />
              <span className="text-gold text-xs tracking-[0.3em] uppercase font-sans">Reviews</span>
              <div className="w-8 h-px bg-gold line-reveal origin-center" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
              Wat <span className="italic text-gold">Klanten</span> Zeggen
            </h2>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 text-gold fill-gold" />
                ))}
              </div>
              <span className="text-white/60 font-sans text-sm">5.0 uit 5 op Google</span>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Rashid B.',
                stars: 5,
                text: 'Beste barber in Almere! Iwan weet precies wat hij doet. Mijn fade is altijd perfect. Geen enkele andere barber komt in de buurt.',
                time: '2 weken geleden',
                service: 'Taper Fade'
              },
              {
                name: 'Marcus D.',
                stars: 5,
                text: 'Al jaren klant bij Barber Iwan. De precisie en aandacht voor detail is ongeëvenaard. Echte vakman!',
                time: '1 maand geleden',
                service: 'Beard Trim'
              },
              {
                name: 'Jamal K.',
                stars: 5,
                text: 'Eindelijk een barber die begrijpt wat ik wil. Mijn waves hebben nog nooit zo goed gezeten. Top service!',
                time: '3 weken geleden',
                service: 'Waves + Lineup'
              },
              {
                name: 'Thomas V.',
                stars: 5,
                text: 'Geweldige ervaring. Rustige sfeer, professioneel werk. Mijn nieuwe vaste barber in Almere!',
                time: '1 week geleden',
                service: 'Classic Cut'
              },
              {
                name: 'Kevin O.',
                stars: 5,
                text: 'De hot towel shave is een aanrader. 30 jaar ervaring merk je aan alles. Absolute topklasse.',
                time: '2 maanden geleden',
                service: 'Hot Towel Shave'
              },
              {
                name: 'David M.',
                stars: 5,
                text: 'Mijn zoon en ik komen hier al jaren. Iwan werkt met passie en dat zie je terug in elk kapsel.',
                time: '3 weken geleden',
                service: 'Father & Son Cut'
              },
            ].map((review, index) => (
              <div
                key={index}
                className="border border-white/10 bg-[#080808] p-6 hover:border-gold/30 transition-all group"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-white/70 text-sm leading-relaxed mb-6 font-sans italic">
                  "{review.text}"
                </p>

                {/* Service badge */}
                <div className="inline-block border border-gold/20 px-3 py-1 mb-4">
                  <span className="text-gold text-xs tracking-widest uppercase font-sans">{review.service}</span>
                </div>

                {/* Author */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                      <span className="text-gold font-serif text-lg">{review.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-white font-sans text-sm">{review.name}</p>
                      <p className="text-white/30 text-xs font-sans">{review.time}</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 opacity-30 group-hover:opacity-60 transition-opacity">
                    <svg viewBox="0 0 24 24" fill="white"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Google CTA */}
          <div className="mt-12 text-center">
            <a
              href="https://www.google.com/search?q=barber+iwan+almere+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-white/20 px-8 py-4 text-white/60 hover:text-gold hover:border-gold/50 transition-all font-sans text-xs tracking-[0.2em] uppercase"
              data-cursor-hover
            >
              <Star className="w-4 h-4 text-gold fill-gold" />
              Bekijk alle reviews op Google
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,74,0.03)_0%,_transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-8 text-center relative">
          <div className="font-serif text-4xl md:text-5xl lg:text-6xl italic leading-tight mb-8">
            <span className="text-gold text-6xl opacity-30 absolute -top-8 -left-4">"</span>
            Een goede barber begrijpt niet alleen haar,
            <span className="text-gold"> maar de persoon erachter</span>.
            <span className="text-gold text-6xl opacity-30 absolute -bottom-8 -right-4">"</span>
          </div>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="w-12 h-px bg-gold line-reveal origin-right" />
            <span className="text-white/40 text-xs tracking-[0.3em] uppercase font-sans">Barber Iwan</span>
            <div className="w-12 h-px bg-gold line-reveal origin-left" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="py-32 relative bg-[#0a0a0a] overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20">
            {/* Left - Info */}
            <div className="contact-info">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-px bg-gold line-reveal origin-left" />
                <span className="text-gold text-xs tracking-[0.3em] uppercase font-sans">Contact</span>
              </div>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-12">
                Kom langs in <br />
                <span className="italic text-gold">Almere</span>
              </h2>

              <div className="space-y-8">
                {[
                  { icon: MapPin, label: 'Adres', lines: ['Michelangelostraat 195', '1328 VX Almere'] },
                  { icon: Phone, label: 'Telefoon', lines: ['06 — 27 40 36 07'], isLink: true },
                ].map((item, index) => (
                  <Spotlight key={index} className="flex items-start gap-6 group p-2 -m-2">
                    <div className="w-12 h-12 border border-gold/30 flex items-center justify-center flex-shrink-0 group-hover:border-gold group-hover:bg-gold/5 transition-all">
                      <item.icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-2 font-sans">{item.label}</h4>
                      {item.lines.map((line, i) => (
                        <p key={i} className="text-lg">
                          {item.isLink ? (
                            <a href="tel:0627403607" className="hover:text-gold transition-colors">
                              {line}
                            </a>
                          ) : (
                            line
                          )}
                        </p>
                      ))}
                    </div>
                  </Spotlight>
                ))}

                {/* Hours */}
                <Spotlight className="flex items-start gap-6 group p-2 -m-2">
                  <div className="w-12 h-12 border border-gold/30 flex items-center justify-center flex-shrink-0 group-hover:border-gold group-hover:bg-gold/5 transition-all">
                    <Clock className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-4 font-sans">Openingstijden</h4>
                    <div className="space-y-0 border-t border-white/10">
                      {openingHours.map((item, index) => {
                        const isClosed = item.hours === 'Gesloten';
                        const isWeekend = item.day === 'Za' || item.day === 'Zo';
                        return (
                          <div
                            key={index}
                            className={`flex justify-between items-center py-2.5 border-b border-white/5 ${
                              isClosed ? 'opacity-40' : ''
                            } ${isWeekend ? 'bg-white/[0.02]' : ''}`}
                          >
                            <span className={`text-sm font-sans tracking-wide ${
                              isClosed ? 'text-white/40' : 'text-white/70'
                            }`}>
                              {item.day === 'Ma' && 'Maandag'}
                              {item.day === 'Di' && 'Dinsdag'}
                              {item.day === 'Wo' && 'Woensdag'}
                              {item.day === 'Do' && 'Donderdag'}
                              {item.day === 'Vr' && 'Vrijdag'}
                              {item.day === 'Za' && 'Zaterdag'}
                              {item.day === 'Zo' && 'Zondag'}
                            </span>
                            <span className={`text-sm font-sans ${
                              isClosed
                                ? 'text-white/30 italic'
                                : 'text-gold/80'
                            }`}>
                              {item.hours}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Spotlight>
              </div>

              {/* Social */}
              <div className="flex items-center gap-4 mt-12 pt-12 border-t border-white/10">
                <span className="text-xs tracking-[0.2em] uppercase text-white/40 font-sans">Volg ons</span>
                <a
                  href="https://www.instagram.com/barberiwan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-gold hover:text-gold hover:bg-gold/5 transition-all"
                  data-cursor-hover
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right - Map */}
            <TiltCard className="contact-map relative">
              <div className="aspect-square border border-white/10 overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.7754266536!2d5.2693787765566!3d52.3687557720329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c6163463665555%3A0xbbf6017322aba99d!2sBarber%20Iwan!5e0!3m2!1snl!2snl!4v1704067200000!5m2!1snl!2snl"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Barber Iwan Locatie"
                />
              </div>
              <div className="absolute -top-4 -left-4 w-full h-full border border-gold/20 -z-10" />
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,74,0.08)_0%,_transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">
            Klaar voor een <span className="italic text-gold">nieuwe look</span>?
          </h2>
          <p className="text-white/60 mb-10 font-light">Boek nu je afspraak en ervaar het verschil van dertig jaar vakmanschap.</p>
          <MagneticButton
            onClick={() => scrollTo('booking')}
            className="btn-cta btn-cta-ring animate-cta-pulse text-black font-sans text-sm tracking-[0.2em] uppercase px-16 py-8 rounded-sm"
          >
            <Calendar className="w-5 h-5 mr-3 inline" />
            Afspraak Maken
          </MagneticButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <img src="/logo.png" alt="Barber Iwan - Herenkapper Almere" className="h-20 w-auto" />
            <p className="text-white/30 text-xs tracking-wider font-sans">© {new Date().getFullYear()} — Alle rechten voorbehouden</p>
            <Link
              to="/terms"
              className="text-white/30 text-xs tracking-wider hover:text-gold transition-colors font-sans"
              data-cursor-hover
            >
              Algemene Voorwaarden
            </Link>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
}

export default App;
