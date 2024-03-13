/** Copyright (c) 2024, Tegon, all rights reserved. **/

/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { AppLayout } from 'common/layouts/app-layout';

import { Loader } from 'components/ui/loader';
import { useApplicationStore } from 'hooks/use-application-store';

import { TeamStoreProvider } from 'store/team-store-provider';
import { UserContext } from 'store/user-context';

import { FiltersView } from '../all/filters-view';
import { Header } from '../all/header';
import { ListView } from '../all/list-view';

export function MyIssues() {
  const user = React.useContext(UserContext);
  const applicationStore = useApplicationStore();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    applicationStore.update({ assignee: user.id });
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex flex-col">
      <Header />
      <FiltersView />
      <div className="grow">{loading ? <Loader /> : <ListView />}</div>
    </main>
  );
}

MyIssues.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <AppLayout>
      <TeamStoreProvider>{page}</TeamStoreProvider>
    </AppLayout>
  );
};
