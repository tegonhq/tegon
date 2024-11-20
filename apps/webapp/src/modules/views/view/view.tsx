import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
import React from 'react';

import { FiltersView } from 'modules/issues/filters-view/filters-view';

import { AppLayout } from 'common/layouts/app-layout';
import { ContentBox } from 'common/layouts/content-box';
import { MainLayout } from 'common/layouts/main-layout';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { useContextStore } from 'store/global-context-provider';

import { Header } from './header';
import { ViewDisplayOptions } from './view-display-options';
import { ViewList } from './view-list';

export const View = withApplicationStore(
  observer(() => {
    const { viewId } = useParams();
    const { viewsStore } = useContextStore();
    const view = viewsStore.getViewWithId(viewId);

    if (!view) {
      return null;
    }

    return (
      <MainLayout header={<Header title={view.name} view={view} />}>
        <ContentBox>
          <FiltersView Actions={<ViewDisplayOptions view={view} />} />

          <ViewList view={view} />
        </ContentBox>
      </MainLayout>
    );
  }),
);

View.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
