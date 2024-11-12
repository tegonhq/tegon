import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@tegonhq/ui/components/resizable';
import React from 'react';

import { AppLayout } from 'common/layouts/app-layout';
import { ContentBox } from 'common/layouts/content-box';
import { SCOPES } from 'common/scopes';

import { useScope } from 'hooks';

import { Header } from './left-side/header';
import { TriageIssues } from './left-side/triage-issues';
import { RightSide } from './right-side';

export function Triage() {
  useScope(SCOPES.AllIssues);

  return (
    <main className="flex flex-col h-[100vh]">
      <Header title="Triage" />

      <ContentBox>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            maxSize={50}
            defaultSize={24}
            minSize={16}
            collapsible
            collapsedSize={16}
          >
            <div className="flex flex-col h-full">
              <h2 className="text-lg pl-4 pt-4 font-medium"> Triage </h2>
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
      </ContentBox>
    </main>
  );
}

Triage.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
