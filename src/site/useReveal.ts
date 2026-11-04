import { useEffect } from 'react';

// Blokken met data-reveal schuiven zacht in beeld als ze de viewport in komen.
// Wat al zichtbaar is bij het laden, blijft gewoon staan: geen flits, en zonder
// JavaScript is alles meteen zichtbaar.
export function useReveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (!('IntersectionObserver' in window)) return;

    const show = (el: Element) => el.setAttribute('data-shown', '');
    const pending: Element[] = [];
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) show(el);
      else pending.push(el);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show(entry.target);
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    pending.forEach((el) => observer.observe(el));
    root.classList.add('reveal-ready');

    return () => observer.disconnect();
  }, []);
}
