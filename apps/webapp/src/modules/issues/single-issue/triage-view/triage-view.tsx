import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@tegonhq/ui/components/resizable';
import * as React from 'react';

import { TriageIssues } from 'modules/issues/triage/left-side/triage-issues';

import { ContentBox } from 'common/layouts/content-box';

import { IssueStoreInit } from 'store/issue-store-provider';

import { Header } from '../header';
import { LeftSide } from '../left-side/left-side';

export function TriageView() {
  return (
    <main className="flex flex-col h-[100vh]">
      <Header isTriageView />

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
              <h2 className="text-lg pl-6 pt-6 font-medium"> Triage </h2>
              <TriageIssues />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel collapsible collapsedSize={0}>
            <IssueStoreInit>
              <LeftSide />
            </IssueStoreInit>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ContentBox>
    </main>
  );
}
