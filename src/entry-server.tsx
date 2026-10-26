// Bouwstap: rendert elke pagina naar HTML (zie scripts/prerender.mjs).
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { Page } from './site/Page';
import type { PageId } from './site/pages';

export { pages } from './site/pages';
export { adminHeadTags, headTags } from './site/seo';
export { llmsTxt, sitemapXml } from './site/feeds';

export function render(id: PageId): string {
  return renderToString(
    <StrictMode>
      <Page id={id} />
    </StrictMode>,
  );
}
