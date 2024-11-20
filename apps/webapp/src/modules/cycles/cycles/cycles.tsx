import { AppLayout } from 'common/layouts/app-layout';
import { MainLayout } from 'common/layouts/main-layout';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { CycleList } from './cycle-list';
import { Header } from '../header';

export const Cycles = withApplicationStore(() => {
  return (
    <MainLayout header={<Header title="All cycles" />}>
      <CycleList />
    </MainLayout>
  );
});

Cycles.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
