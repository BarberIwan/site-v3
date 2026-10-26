import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';
import { Page } from './site/Page';
import { legacyTarget, pageForPath, pages, type PageMeta } from './site/pages';

const root = document.getElementById('root')!;
const { pathname, hash } = window.location;

// Een niet-bestaand adres krijgt van de huidige server de homepage-HTML. Dan
// tonen we de 404-pagina en zeggen we zoekmachines dat ze hem niet opnemen.
function markNotFound(page: PageMeta) {
  document.title = page.title;
  document.querySelector('link[rel="canonical"]')?.remove();
  document.querySelectorAll('script[type="application/ld+json"]').forEach((el) => el.remove());
  let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (!robots) {
    robots = document.createElement('meta');
    robots.name = 'robots';
    document.head.append(robots);
  }
  robots.content = 'noindex, follow';
}

if (pathname === '/admin' || pathname.startsWith('/admin/')) {
  import('./admin/mount').then(({ mountAdmin }) => mountAdmin(root));
} else {
  const target = legacyTarget(pathname, hash);
  if (target) {
    window.location.replace(target);
  } else {
    const page = pageForPath(pathname) ?? pages['niet-gevonden'];
    const app = (
      <StrictMode>
        <Page id={page.id} />
      </StrictMode>
    );
    if (root.dataset.page === page.id && root.firstElementChild) {
      hydrateRoot(root, app);
    } else {
      if (page.id === 'niet-gevonden') markNotFound(page);
      else if (!document.title) document.title = page.title;
      root.dataset.page = page.id;
      root.replaceChildren();
      createRoot(root).render(app);
    }
  }
}
