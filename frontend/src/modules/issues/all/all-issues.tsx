/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { ImperativePanelHandle } from 'react-resizable-panels';

import React from 'react';

import { AppLayout } from 'common/layouts/app-layout';
import { SCOPES } from 'common/scopes';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from 'components/ui/resizable';
import { useScope } from 'hooks';

import { DisplayPopover } from './display-popover';
import { Header } from './header';
import { ListView } from './list-view';
import { FiltersView } from '../filters-view/filters-view';

export const AllIssues = withApplicationStore(() => {
  useScope(SCOPES.AllIssues);
  const ref = React.useRef<ImperativePanelHandle>(null);

  return (
    <main className="flex flex-col h-[100vh]">
      <Header title="All issues" />
      <div className="bg-gray-200 rounded-tl-2xl flex flex-col h-[calc(100vh_-_53px)]">
        <FiltersView
          Actions={
            <>
              <DisplayPopover />
            </>
          }
        />
        <ResizablePanelGroup direction="horizontal" className="">
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
            {/* <OverviewInsights title="All Issues" /> */}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
});

AllIssues.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
