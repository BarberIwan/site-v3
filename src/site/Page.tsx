import { Layout } from './Layout';
import type { PageId } from './pages';
import { Home } from './pages/Home';
import { About, Beard, BlackHair, Contact, Fade, Haircuts, Kids, NotFound, Prices } from './pages/Subpages';
import { Terms } from './pages/Terms';

const content: Record<PageId, () => React.JSX.Element> = {
  home: Home,
  prijzen: Prices,
  haircuts: Haircuts,
  fade: Fade,
  'black-hair': BlackHair,
  baard: Beard,
  kinderen: Kids,
  over: About,
  contact: Contact,
  voorwaarden: Terms,
  'niet-gevonden': NotFound,
};

export function Page({ id }: { id: PageId }) {
  const Content = content[id];
  return (
    <Layout current={id}>
      <Content />
    </Layout>
  );
}
