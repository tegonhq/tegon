import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@tegonhq/ui/components/resizable';
import React, { useState } from 'react';

import { AppLayout } from 'common/layouts/app-layout';
import { ContentBox } from 'common/layouts/content-box';
import { SCOPES } from 'common/scopes';

import { useScope } from 'hooks';
import { useTriageShortcuts } from './use-triage-shortcuts';  // Import the custom hook
import { Header } from './left-side/header';
import { TriageIssues } from './left-side/triage-issues';
import { RightSide } from './right-side';

export function Triage() {
  useScope(SCOPES.AllIssues);

  // Define state to manage Accept and Decline actions
  const [triageAction, setTriageAction] = useState<'Accept' | 'Decline'>(undefined);

  // Define Accept action
  const acceptTriage = () => {
    console.log('Triage Accepted');
    setTriageAction('Accept');
    // Add your accept logic here (e.g., update state, refresh issues)
  };

  // Define Decline action
  const declineTriage = () => {
    console.log('Triage Declined');
    setTriageAction('Decline');
    // Add your decline logic here (e.g., update state, refresh issues)
  };

  // Use the custom shortcut hook to handle A for Accept and D for Decline
  useTriageShortcuts(
    { onAccept: acceptTriage, onDecline: declineTriage },  // Define actions
    []  // Dependencies, empty if none needed
  );

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
      </ContentBox>
    </main>
  );
}

Triage.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};