/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { ImperativePanelHandle } from 'react-resizable-panels';

import React from 'react';

import { AppLayout } from 'common/layouts/app-layout';
import { SCOPES } from 'common/scopes';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from 'components/ui/resizable';
import { useScope } from 'hooks';

import { Header } from './left-side/header';
import { TriageIssues } from './left-side/triage-issues';
import { RightSide } from './right-side';

export function Triage() {
  useScope(SCOPES.AllIssues);
  const ref = React.useRef<ImperativePanelHandle>(null);

  return (
    <main className="flex flex-col h-[100vh]">
      <Header title="Triage" />

      <div className="bg-background-2 rounded-tl-3xl flex h-[calc(100vh_-_53px)]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            maxSize={50}
            ref={ref}
            defaultSize={24}
            minSize={16}
            collapsible
            collapsedSize={16}
          >
            <div className="flex flex-col h-full">
              <h2 className="text-lg pl-6 pt-6 font-medium"> Triage </h2>
              <TriageIssues />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            collapsible
            collapsedSize={0}
            className="flex items-center justify-center"
          >
            <RightSide />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
}

Triage.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
