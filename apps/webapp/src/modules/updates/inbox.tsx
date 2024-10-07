import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@tegonhq/ui/components/resizable';
import React from 'react';

import { AppLayout } from 'common/layouts/app-layout';
import { ContentBox } from 'common/layouts/content-box';

import { Header } from './header';
import { NotificationsList } from './notifications-list';
import { NotificationRightSide } from './right-side';

export function Inbox() {
  return (
    <main className="flex flex-col h-[100vh]">
      <Header />

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
              <h2 className="text-lg pl-6 pt-6 font-medium"> Inbox </h2>
              <NotificationsList />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            collapsible
            collapsedSize={0}
            className="flex flex-col items-center justify-center"
          >
            <NotificationRightSide />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ContentBox>
    </main>
  );
}

Inbox.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
