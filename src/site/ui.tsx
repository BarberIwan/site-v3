import type { ReactNode } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { photoSrc, photoWebp, type Faq, type Photo } from './data';

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
      <source type="image/webp" srcSet={photo.webp.map((w) => `${photoWebp(photo, w)} ${w}w`).join(', ')} sizes={sizes} />
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

export function Logo({ className, alt = 'Barber Iwan', sizes = '336px' }: { className: string; alt?: string; sizes?: string }) {
  return (
    <picture>
      <source type="image/webp" srcSet="/img/logo-336.webp 336w, /img/logo-672.webp 672w" sizes={sizes} />
      <img src="/img/logo-672.png" width={672} height={448} alt={alt} className={className} decoding="async" />
    </picture>
  );
}

// Klein gouden label boven een kop, eventueel met sectienummer.
export function Eyebrow({ children, number }: { children: ReactNode; number?: string }) {
  return (
    <p className="eyebrow mb-6">
      {number && <span className="text-white/40">{number}</span>}
      {children}
    </p>
  );
}

export function ArrowLink({ href, children, external = false }: { href: string; children: ReactNode; external?: boolean }) {
  return (
    <a href={href} className="link-arrow" {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
      <ArrowRight className="w-4 h-4" aria-hidden="true" />
    </a>
  );
}

// Uitklapbare vragen met <details>: werkt zonder JavaScript en de antwoorden
// staan gewoon in de HTML.
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="border-t border-white/10">
      {items.map((item, index) => (
        <details key={item.q} className="faq-item group border-b border-white/10">
          <summary className="flex items-center justify-between gap-6 py-6 cursor-pointer list-none">
            <span className="flex items-baseline gap-5">
              <span className="text-gold/50 font-serif text-sm tabular-nums" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="font-serif text-xl md:text-2xl text-white/90 group-open:text-gold transition-colors">{item.q}</span>
            </span>
            <ChevronDown className="w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="pb-7 pl-10 md:pl-11 max-w-2xl">
            <p className="text-white/60 leading-relaxed">{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
