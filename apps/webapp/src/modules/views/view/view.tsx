import { Button } from '@tegonhq/ui/components/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@tegonhq/ui/components/resizable';
import { RightSidebarClosed, RightSidebarOpen } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
import React from 'react';

import { FiltersView } from 'modules/issues/filters-view/filters-view';
import { OverviewInsights } from 'modules/issues/overview-insights';

import { AppLayout } from 'common/layouts/app-layout';
import { ContentBox } from 'common/layouts/content-box';
import { MainLayout } from 'common/layouts/main-layout';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { useLocalState } from 'hooks/use-local-state';

import { useContextStore } from 'store/global-context-provider';

import { Header } from './header';
import { ViewDisplayOptions } from './view-display-options';
import { ViewList } from './view-list';

export const View = withApplicationStore(
  observer(() => {
    const { viewId } = useParams();
    const { viewsStore } = useContextStore();
    const view = viewsStore.getViewWithId(viewId);
    const [overview, setOverview] = useLocalState('insightsSidebar', false);

    if (!view) {
      return null;
    }

    return (
      <MainLayout
        header={
          <Header
            title={view.name}
            view={view}
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
        <ContentBox>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
              collapsible={false}
              order={1}
              id="issues"
              className="w-full flex flex-col"
            >
              <FiltersView Actions={<ViewDisplayOptions view={view} />} />

              <ViewList view={view} />
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
        </ContentBox>
      </MainLayout>
    );
  }),
);

View.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
