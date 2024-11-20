import { Button } from '@tegonhq/ui/components/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@tegonhq/ui/components/resizable';
import { RightSidebarClosed, RightSidebarOpen } from '@tegonhq/ui/icons';
import React from 'react';

import { AppLayout } from 'common/layouts/app-layout';
import { ContentBox } from 'common/layouts/content-box';
import { MainLayout } from 'common/layouts/main-layout';
import { SCOPES } from 'common/scopes';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { useScope } from 'hooks';
import { useCurrentTeam } from 'hooks/teams';
import { useLocalState } from 'hooks/use-local-state';

import { Header } from './header';
import { IssuesViewOptions } from './issues-view-options';
import { ListView } from './list-view';
import { FiltersView } from '../filters-view/filters-view';
import { OverviewInsights } from '../overview-insights';

export const AllIssues = withApplicationStore(() => {
  useScope(SCOPES.AllIssues);
  const team = useCurrentTeam();
  const [overview, setOverview] = useLocalState('insightsSidebar', false);

  return (
    <MainLayout
      header={
        <Header
          title="All issues"
          team={team}
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
            className="w-full"
          >
            <FiltersView Actions={<IssuesViewOptions />} />
            <ListView />
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
});

AllIssues.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
