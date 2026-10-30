import { createSignal } from 'solid-js';
import { MainMenu, InPageNavigation, Pagination, HelpPanel, TutorialPanel } from '@unofficial-krds/solid';

export default function App() {
  const [query, setQuery] = createSignal('server query');
  const [page, setPage] = createSignal(8);
  const [events, setEvents] = createSignal<string[]>([]);
  const record = (name: string) => setEvents(previous => [...previous, name]);
  return <div>
    <section id="hydration-menu"><MainMenu query={query()} onQueryChange={({ value }) => { setQuery(value); record('query'); }} onMobileOpenChange={() => record('mobile')} items={[{ id: 'home', label: 'Home', href: '#home' }, { id: 'apply', label: 'Applications', children: [{ id: 'new', label: 'New application', href: '#new' }] }]}/></section>
    <section id="hydration-outline"><InPageNavigation title="Page outline" narrowMode="disclosure" sections={[{ id: 'overview', label: 'Overview' }, { id: 'requirements', label: 'Requirements' }]} onActiveChange={({ reason }) => { if (reason === 'activation') record('outline'); }}/></section>
    <section id="hydration-pages"><Pagination page={page()} pageCount={20} hrefForPage={value => `#page-${value}`} onPageChange={({ page }) => { setPage(page); record('page'); }}/></section>
    <section id="hydration-help"><HelpPanel topics={[]} onOpenChange={() => record('help')}/></section>
    <section id="hydration-tutorial"><TutorialPanel tasks={[]} activeTaskId={null} activeStepId={null} startActionId="hydration-start" onOpenChange={() => record('tutorial')}/></section>
    <output id="hydration-events">{JSON.stringify(events())}</output>
    <section id="overview" style={{ 'min-height': '800px' }}>Overview content</section>
    <section id="requirements" style={{ 'min-height': '800px' }}>Requirements content</section>
  </div>;
}
