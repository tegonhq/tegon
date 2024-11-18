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
import { SCOPES } from 'common/scopes';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { useScope } from 'hooks';
import { useCurrentTeam } from 'hooks/teams';

import { Header } from './header';
import { IssuesViewOptions } from './issues-view-options';
import { ListView } from './list-view';
import { FiltersView } from '../filters-view/filters-view';
import { OverviewInsights } from '../overview-insights';

export const AllIssues = withApplicationStore(() => {
  useScope(SCOPES.AllIssues);
  const team = useCurrentTeam();
  const [overview, setOverview] = React.useState(false);

  return (
    <main className="flex flex-col h-[100vh]">
      <Header
        title="All issues"
        team={team}
        actions={
          <Button
            variant="ghost"
            onClick={() => setOverview(!overview)}
            size="sm"
          >
            {open ? (
              <RightSidebarOpen size={16} />
            ) : (
              <RightSidebarClosed size={16} />
            )}
          </Button>
        }
      />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          collapsible={false}
          order={1}
          id="issues"
          className="w-full"
        >
          <ContentBox>
            <FiltersView Actions={<IssuesViewOptions />} />
            <ListView />
          </ContentBox>
        </ResizablePanel>
        {overview && (
          <>
            <ResizableHandle className="bg-transparent" />
            <ResizablePanel
              collapsible={false}
              maxSize={25}
              minSize={25}
              defaultSize={25}
              order={2}
              id="rightScreen"
            >
              <ContentBox className="!pl-0">
                <OverviewInsights />
              </ContentBox>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </main>
  );
});

AllIssues.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
