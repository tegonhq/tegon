/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { ImperativePanelHandle } from 'react-resizable-panels';

import React from 'react';

import { AppLayout } from 'common/layouts/app-layout';
import { SCOPES } from 'common/scopes';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { Button } from 'components/ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from 'components/ui/resizable';
import { useScope } from 'hooks';
import { BarFill } from 'icons';

import { DisplayPopover } from './display-popover';
import { Header } from './header';
import { ListView } from './list-view';
import { SaveViewActions } from './save-view-actions';
import { OverviewInsights } from '../components/overview-insights';
import { FiltersView } from '../filters-view/filters-view';

export const AllIssues = withApplicationStore(() => {
  useScope(SCOPES.AllIssues);
  const ref = React.useRef<ImperativePanelHandle>(null);
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <main className="flex flex-col h-[100vh] overflow-hidden">
      <Header title="All issues" />
      <FiltersView
        Actions={
          <>
            <DisplayPopover />
            <SaveViewActions />
            <Button
              variant="outline"
              size="xs"
              className="flex gap-2 items-center"
              isActive={isExpanded}
              onClick={() => {
                const panel = ref.current;
                if (panel.isCollapsed()) {
                  panel.expand();
                  setIsExpanded(true);
                } else {
                  panel.collapse();
                  setIsExpanded(false);
                }
              }}
            >
              <BarFill size={14} />
              Insights
            </Button>
          </>
        }
      />
      <ResizablePanelGroup
        direction="horizontal"
        className="grow overflow-hidden flex"
      >
        <ResizablePanel collapsible collapsedSize={16}>
          <ListView />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          maxSize={30}
          minSize={30}
          ref={ref}
          defaultSize={0}
          collapsible
          collapsedSize={0}
        >
          <OverviewInsights title="All Issues" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
});

AllIssues.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
