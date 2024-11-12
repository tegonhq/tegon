import { AppLayout } from 'common/layouts/app-layout';
import { ContentBox } from 'common/layouts/content-box';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { useLocalState } from 'hooks/use-local-state';

import { Header, type CycleTabs } from '../header';

export const CycleView = withApplicationStore(() => {
  const [view, setView] = useLocalState<CycleTabs>('cycle_tab', 'overview');

  return (
    <main className="flex flex-col h-[100vh]">
      <Header title="Projects" isCycleView view={view} setView={setView} />
      <ContentBox>
        <main className="grid grid-cols-5 h-[calc(100vh_-_53px)]"></main>
      </ContentBox>
    </main>
  );
});

CycleView.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
