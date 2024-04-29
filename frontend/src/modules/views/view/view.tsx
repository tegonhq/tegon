/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
import React from 'react';

import { FiltersView } from 'modules/issues/filters-view/filters-view';

import { AppLayout } from 'common/layouts/app-layout';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { useContextStore } from 'store/global-context-provider';

import { Header } from './header';
import { SaveViewAction } from './save-view-action';
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
      <main className="flex flex-col h-[100vh] overflow-hidden">
        <Header title={view.name} view={view} />
        <FiltersView Actions={<SaveViewAction view={view} />} />

        <ViewList view={view} />
      </main>
    );
  }),
);

View.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
