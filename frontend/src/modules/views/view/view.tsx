/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { ImperativePanelHandle } from 'react-resizable-panels';

import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
import React from 'react';

import { FiltersView } from 'modules/issues/filters-view/filters-view';

import { AppLayout } from 'common/layouts/app-layout';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from 'components/ui/resizable';

import { useContextStore } from 'store/global-context-provider';

import { Header } from './header';
import { ViewDisplayOptions } from './view-display-options';
import { ViewList } from './view-list';

export const View = withApplicationStore(
  observer(() => {
    const { viewId } = useParams();
    const { viewsStore } = useContextStore();
    const view = viewsStore.getViewWithId(viewId);
    const ref = React.useRef<ImperativePanelHandle>(null);

    if (!view) {
      return null;
    }

    return (
      <main className="flex flex-col h-[100vh]">
        <Header title={view.name} view={view} />
        <div className="bg-gray-200 rounded-tl-2xl flex flex-col h-[calc(100vh_-_53px)]">
          <FiltersView Actions={<ViewDisplayOptions />} />

          <ResizablePanelGroup
            direction="horizontal"
            className="grow overflow-hidden flex"
          >
            <ResizablePanel collapsible collapsedSize={16}>
              <ViewList view={view} />
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
              {/* <OverviewInsights title={view.name} /> */}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </main>
    );
  }),
);

View.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
