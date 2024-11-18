import { AppLayout } from 'common/layouts/app-layout';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { CycleList } from './cycle-list';
import { Header } from '../header';

export const Cycles = withApplicationStore(() => {
  return (
    <main className="flex flex-col h-[100vh]">
      <Header title="All cycles" />

      <CycleList />
    </main>
  );
});

Cycles.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
