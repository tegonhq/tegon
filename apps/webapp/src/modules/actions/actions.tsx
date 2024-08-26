import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@tegonhq/ui/components/resizable';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { cn } from '@tegonhq/ui/lib/utils';
import { useParams } from 'next/navigation';

import { Header } from 'modules/settings/header';

import { AppLayout } from 'common/layouts/app-layout';

import { AllActionsList } from './all-actions-list';
import { Empty } from './empty';
import { SingleActionWrapper } from './single-action';

export function Actions() {
  const { actionSlug } = useParams();

  return (
    <main className="flex flex-col h-[100vh]">
      <Header title="Actions" />
      <div className="bg-background-2 rounded-tl-3xl flex flex-col h-[calc(100vh_-_53px)]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            maxSize={50}
            defaultSize={24}
            minSize={16}
            collapsible
            collapsedSize={16}
          >
            <div className="flex flex-col h-full">
              <h2 className="text-lg pl-6 pt-6 font-medium pb-2">Actions</h2>
              <ScrollArea className="h-full">
                <AllActionsList />
              </ScrollArea>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            collapsible
            collapsedSize={0}
            className={cn(!actionSlug && 'flex justify-center items-center')}
          >
            {actionSlug ? <SingleActionWrapper /> : <Empty />}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
}

Actions.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
