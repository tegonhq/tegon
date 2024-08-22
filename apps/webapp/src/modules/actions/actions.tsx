import { ScrollArea } from '@tegonhq/ui/components/scroll-area';

import { Header } from 'modules/settings/header';

import { AppLayout } from 'common/layouts/app-layout';

import { ActionCard } from './components/action-card';

export function Actions() {
  return (
    <main className="flex flex-col h-[100vh]">
      <Header title="Actions" />
      <div className="bg-background-2 rounded-tl-3xl flex flex-col h-[calc(100vh_-_53px)]">
        <ScrollArea className="w-full h-full">
          <div className="py-3 pt-6 pr-4 pl-6 flex flex-col gap-2">
            <div className="flex flex-col h-full gap-3">
              <h2>All actions</h2>

              <div className="grid grid-cols-4 gap-4">
                <ActionCard />
                <ActionCard />
                <ActionCard />
                <ActionCard />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}

Actions.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
