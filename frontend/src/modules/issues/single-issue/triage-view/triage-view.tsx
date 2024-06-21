/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { ImperativePanelHandle } from 'react-resizable-panels';

import * as React from 'react';

import { TriageIssues } from 'modules/issues/triage/left-side/triage-issues';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from 'components/ui/resizable';

import { IssueStoreInit } from 'store/issue-store-provider';

import { Header } from '../header';
import { LeftSide } from '../left-side/left-side';

export function TriageView() {
  const ref = React.useRef<ImperativePanelHandle>(null);

  return (
    <main className="flex flex-col h-[100vh]">
      <Header isTriageView />

      <div className="bg-gray-200 rounded-tl-3xl flex h-[calc(100vh_-_53px)]">
        <ResizablePanelGroup direction="horizontal" className="">
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
          <ResizablePanel collapsible collapsedSize={0}>
            <IssueStoreInit>
              <LeftSide />
            </IssueStoreInit>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
}
