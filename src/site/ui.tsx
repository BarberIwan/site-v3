import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ChevronDown } from 'lucide-react';
import { photoSrc, photoWebp, type Faq, type Photo } from './data';

// Custom Cursor Component
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'power2.out' });
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.02, ease: 'none' });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', moveCursor);

    // Add hover detection for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, summary, [data-cursor-hover]');
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
      <div ref={cursorRef} className={`custom-cursor ${isHovering ? 'hover' : ''}`} style={{ left: 0, top: 0 }} aria-hidden="true" />
      <div ref={dotRef} className="custom-cursor-dot" style={{ left: 0, top: 0 }} aria-hidden="true" />
    </>
  );
}

function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
  };

  const onMouseLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
  };

  return { ref, onMouseMove, onMouseLeave };
}

// Magnetic Button Component
export function MagneticButton({
  children,
  onClick,
  className = '',
  label,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  label?: string;
}) {
  const magnetic = useMagnetic<HTMLButtonElement>();
  return (
    <button type="button" {...magnetic} onClick={onClick} className={`magnetic ${className}`} aria-label={label} data-cursor-hover>
      {children}
    </button>
  );
}

// Zelfde effect als MagneticButton, maar een echte link die zoekmachines volgen.
export function MagneticLink({
  children,
  href,
  className = '',
  current = false,
  label,
}: {
  children: ReactNode;
  href: string;
  className?: string;
  current?: boolean;
  label?: string;
}) {
  const magnetic = useMagnetic<HTMLAnchorElement>();
  return (
    <a
      {...magnetic}
      href={href}
      className={`magnetic ${className}`}
      aria-current={current ? 'page' : undefined}
      aria-label={label}
      data-cursor-hover
    >
      {children}
    </a>
  );
}

// Tilt Card Component
export function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, { rotateY: x * 10, rotateX: -y * 10, duration: 0.3, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' });
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
export function Spotlight({ children, className = '' }: { children: ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    container.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`);
    container.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`spotlight ${className}`}
      style={{ '--spotlight-x': '50%', '--spotlight-y': '50%' } as React.CSSProperties}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(600px circle at var(--spotlight-x) var(--spotlight-y), rgba(201, 168, 74, 0.06), transparent 40%)',
        }}
      />
      {children}
    </div>
  );
}

// Foto met WebP-varianten en vaste afmetingen (geen verspringende layout).
export function Picture({
  photo,
  sizes,
  className = 'block w-full h-full',
  imgClassName = 'w-full h-full object-cover',
  priority = false,
  alt,
}: {
  photo: Photo;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  alt?: string;
}) {
  return (
    <picture className={className}>
      <source
        type="image/webp"
        srcSet={photo.webp.map((w) => `${photoWebp(photo, w)} ${w}w`).join(', ')}
        sizes={sizes}
      />
      <img
        src={photoSrc(photo)}
        width={photo.width}
        height={photo.height}
        alt={alt ?? photo.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        className={imgClassName}
      />
    </picture>
  );
}

export function Logo({ className, alt = 'Barber Iwan' }: { className: string; alt?: string }) {
  return (
    <picture>
      <source type="image/webp" srcSet="/img/logo-336.webp 336w, /img/logo-672.webp 672w" sizes="336px" />
      <img src="/img/logo-672.png" width={672} height={448} alt={alt} className={className} decoding="async" />
    </picture>
  );
}

// Gouden lijntje met een klein label erboven, zoals overal op de site.
export function SectionLabel({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <div className={`flex items-center gap-4 mb-6 ${center ? 'justify-center' : ''}`}>
      <div className={`w-8 h-px bg-gold line-reveal ${center ? 'origin-center' : 'origin-left'}`} />
      <span className="text-gold text-xs tracking-[0.3em] uppercase font-sans">{children}</span>
      {center && <div className="w-8 h-px bg-gold line-reveal origin-center" />}
    </div>
  );
}

// Uitklapbare vragen met <details>: werkt zonder JavaScript en de antwoorden
// staan gewoon in de HTML.
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <details key={item.q} className="faq-item group border border-white/10 bg-[#0a0a0a] open:border-gold/40 open:bg-[#080808] transition-all">
          <summary className="w-full flex items-center justify-between p-6 text-left cursor-pointer list-none">
            <span className="flex items-center gap-4">
              <span className="text-gold/40 font-serif text-sm" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="font-sans text-sm tracking-wide text-white/80 group-hover:text-white group-open:text-gold transition-colors">
                {item.q}
              </span>
            </span>
            <ChevronDown className="w-5 h-5 text-gold flex-shrink-0 ml-4 transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="px-6 pb-6 pl-16">
            <p className="text-white/60 text-sm leading-relaxed font-sans">{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
