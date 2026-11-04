import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react';
import { photoTags, type Photo, type PhotoTag } from './data';
import { Picture } from './ui';

type Filter = PhotoTag | 'alles';

// Portfolio met filter per stijl en een lightbox. Vooraf gerenderd staan alle
// foto's met bijschrift in de HTML; filteren en vergroten komt er in de browser bij.
export function Gallery({ items, filters = true }: { items: Photo[]; filters?: boolean }) {
  const [filter, setFilter] = useState<Filter>('alles');
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const visible = filter === 'alles' ? items : items.filter((p) => p.tags.includes(filter));
  const current = index === null ? null : visible[index];
  const tagCounts = photoTags
    .map((t) => ({ ...t, count: items.filter((p) => p.tags.includes(t.id)).length }))
    .filter((t) => t.count > 0);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + visible.length) % visible.length));

  return (
    <>
      {filters && (
        <div role="group" aria-label="Filter op stijl" className="flex flex-wrap gap-2 mb-12">
          {[{ id: 'alles' as Filter, label: 'Alles', count: items.length }, ...tagCounts].map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={filter === t.id}
              onClick={() => setFilter(t.id)}
              className={`px-5 py-2.5 text-xs tracking-[0.18em] uppercase border transition-colors ${
                filter === t.id ? 'border-gold text-gold bg-gold/[0.06]' : 'border-white/15 text-white/60 hover:text-white hover:border-white/30'
              }`}
            >
              {t.label} <span className="text-white/30 ml-1">{t.count}</span>
            </button>
          ))}
        </div>
      )}

      <ul className="columns-1 sm:columns-2 lg:columns-3 gap-5">
        {visible.map((photo, i) => (
          <li key={photo.slug} className="break-inside-avoid mb-8">
            <figure className="group">
              <button
                type="button"
                onClick={() => open(i)}
                className="img-hover relative block w-full border border-white/10"
                aria-label={`Vergroot: ${photo.title}`}
                style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
              >
                <Picture photo={photo} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" />
                <span className="absolute right-3 top-3 w-9 h-9 flex items-center justify-center bg-black/50 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                  <Maximize2 className="w-4 h-4" />
                </span>
              </button>
              <figcaption className="mt-3">
                <span className="block font-serif text-xl">{photo.title}</span>
                <span className="block text-white/45 text-sm">{photo.caption}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={current ? current.title : 'Foto'}
        onClose={() => setIndex(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1);
          if (e.key === 'ArrowLeft') step(-1);
        }}
      >
        {current && (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-10 text-white" onClick={(e) => e.target === e.currentTarget && close()}>
            <figure className="max-w-3xl w-full flex flex-col items-center">
              <Picture
                photo={current}
                sizes="(min-width: 768px) 768px, 100vw"
                className="block"
                imgClassName="max-h-[78svh] w-auto object-contain"
              />
              <figcaption className="mt-4 text-center">
                <span className="block font-serif text-2xl">{current.title}</span>
                <span className="block text-white/55 text-sm">{current.caption}</span>
              </figcaption>
            </figure>
            <div className="mt-6 flex items-center gap-3">
              <button type="button" onClick={() => step(-1)} className="w-12 h-12 border border-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors" aria-label="Vorige foto">
                <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              </button>
              <span className="text-xs tracking-[0.2em] text-white/45 tabular-nums w-16 text-center">
                {(index ?? 0) + 1} / {visible.length}
              </span>
              <button type="button" onClick={() => step(1)} className="w-12 h-12 border border-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors" aria-label="Volgende foto">
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <button type="button" onClick={close} className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white" aria-label="Sluiten" autoFocus>
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
