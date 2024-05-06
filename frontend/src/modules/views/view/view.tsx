/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { ImperativePanelHandle } from 'react-resizable-panels';

import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
import React from 'react';

import { DisplayPopover } from 'modules/issues/all/display-popover';
import { OverviewInsights } from 'modules/issues/components/overview-insights';
import { FiltersView } from 'modules/issues/filters-view/filters-view';

import { AppLayout } from 'common/layouts/app-layout';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { Button } from 'components/ui/button';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from 'components/ui/resizable';
import { BarFill } from 'icons';

import { useContextStore } from 'store/global-context-provider';

import { Header } from './header';
import { SaveViewAction } from './save-view-action';
import { ViewList } from './view-list';

export const View = withApplicationStore(
  observer(() => {
    const { viewId } = useParams();
    const { viewsStore } = useContextStore();
    const view = viewsStore.getViewWithId(viewId);
    const ref = React.useRef<ImperativePanelHandle>(null);
    const [isExpanded, setIsExpanded] = React.useState(false);

    if (!view) {
      return null;
    }

    return (
      <main className="flex flex-col h-[100vh] overflow-hidden">
        <Header title={view.name} view={view} />
        <FiltersView
          Actions={
            <>
              <DisplayPopover />
              <SaveViewAction view={view} />{' '}
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
            <OverviewInsights title={view.name} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    );
  }),
);

View.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
