import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@tegonhq/ui/components/resizable';
import * as React from 'react';

import { AppLayout } from 'common/layouts/app-layout';
import { MainLayout } from 'common/layouts/main-layout';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { Header } from './header';
import { IssuesViewOptions } from '../all/issues-view-options';
import { ListView } from '../all/list-view';
import { FiltersView } from '../filters-view/filters-view';

export const MyIssues = withApplicationStore(() => {
  return (
    <MainLayout header={<Header />}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          collapsible={false}
          order={1}
          id="issues"
          className="w-full flex flex-col"
        >
          <FiltersView Actions={<IssuesViewOptions />} />
          <ListView />
        </ResizablePanel>
      </ResizablePanelGroup>
    </MainLayout>
  );
});

MyIssues.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
