import { Button } from '@tegonhq/ui/components/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@tegonhq/ui/components/resizable';
import { RightSidebarClosed, RightSidebarOpen } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';

import { ListView } from 'modules/issues/all/list-view';
import { FiltersView } from 'modules/issues/filters-view/filters-view';
import { OverviewInsights } from 'modules/issues/overview-insights';

import { AppLayout } from 'common/layouts/app-layout';
import { MainLayout } from 'common/layouts/main-layout';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { useCycle } from 'hooks/cycles';
import { useLocalState } from 'hooks/use-local-state';

import { CycleDisplayOptions } from './cycle-display-options';
import { CycleProgress } from './cycle-progress';
import { Overview } from './overview';
import { Header, type CycleTabs } from '../header';

export const CycleView = observer(({ view }: { view: CycleTabs }) => {
  const cycle = useCycle();

  if (!cycle) {
    return null;
  }

  return (
    <>
      <CycleProgress id={cycle?.id} />
      {view === 'issues' && (
        <>
          <FiltersView Actions={<CycleDisplayOptions />} />
          <ListView />
        </>
      )}
      {view === 'overview' && <Overview />}
    </>
  );
});

export const CycleViewWrapper = withApplicationStore(() => {
  const [view, setView] = useLocalState<CycleTabs>('cycle_tab', 'overview');
  const [overview, setOverview] = useLocalState('insightsSidebar', false);

  return (
    <MainLayout
      header={
        <Header
          title="Cycles"
          isCycleView
          view={view}
          setView={setView}
          actions={
            <Button
              variant="ghost"
              onClick={() => setOverview(!overview)}
              isActive={overview}
              size="sm"
            >
              {overview ? (
                <RightSidebarOpen size={18} />
              ) : (
                <RightSidebarClosed size={18} />
              )}
            </Button>
          }
        />
      }
    >
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          collapsible={false}
          order={1}
          id="issues"
          className="w-full flex flex-col"
        >
          <CycleView view={view} />
        </ResizablePanel>
        {overview && (
          <>
            <ResizableHandle />
            <ResizablePanel
              collapsible={false}
              maxSize={25}
              minSize={25}
              defaultSize={25}
              order={2}
              id="rightScreen"
            >
              <OverviewInsights />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </MainLayout>
  );
});

CycleViewWrapper.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
