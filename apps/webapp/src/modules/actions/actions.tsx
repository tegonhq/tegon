import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@tegonhq/ui/components/resizable';
import { Header } from 'modules/settings/header';

import { AppLayout } from 'common/layouts/app-layout';
import { AllActions } from './all-actions';
import { useParams } from 'next/navigation';
import { SingleAction } from './single-action';
import { Empty } from './empty';
import { cn } from '@tegonhq/ui/lib/utils';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';

export function Actions() {
  const { actionSlug } = useParams();

  return (
    <main className="flex flex-col h-[100vh]">
      <Header title="Actions" />
      <div className="bg-background-2 rounded-tl-3xl flex flex-col h-[calc(100vh_-_53px)]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            maxSize={24}
            defaultSize={24}
            minSize={24}
            collapsible={false}
          >
            <ScrollArea className="h-full">
              <div className="flex flex-col h-full">
                <h2 className="text-lg pl-6 pt-6 font-medium pb-2">Actions</h2>
                <AllActions />
              </div>
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            collapsible
            collapsedSize={0}
            className={cn(
              actionSlug ? 'flex' : 'flex justify-center items-center',
            )}
          >
            {actionSlug ? <SingleAction /> : <Empty />}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
}

Actions.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
