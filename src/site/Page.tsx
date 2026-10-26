import { Layout } from './Layout';
import type { PageId } from './pages';
import { Home } from './pages/Home';
import { BlackHair, Contact, Haircuts, Kids, NotFound, Prices } from './pages/Subpages';
import { Terms } from './pages/Terms';

const content: Record<PageId, () => React.JSX.Element> = {
  home: Home,
  prijzen: Prices,
  haircuts: Haircuts,
  'black-hair': BlackHair,
  kinderen: Kids,
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
