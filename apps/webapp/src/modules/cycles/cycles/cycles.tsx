import { cn } from '@tegonhq/ui/lib/utils';

import { AppLayout } from 'common/layouts/app-layout';
import { MainLayout } from 'common/layouts/main-layout';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { CycleList } from './cycle-list';
import { Header } from '../header';

export const Cycles = withApplicationStore(() => {
  return (
    <MainLayout header={<Header title="All cycles" />}>
      <main className={cn('p-3 pt-0 pl-3 h-[calc(100vh_-_48px)]')}>
        <CycleList />
      </main>
    </MainLayout>
  );
});

Cycles.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
