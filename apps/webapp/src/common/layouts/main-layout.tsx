import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@tegonhq/ui/components/resizable';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';

import { AI } from 'modules/ai';

import { SCOPES } from 'common/scopes';

import { useContextStore } from 'store/global-context-provider';

import { ContentBox } from './content-box';

interface MainLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const MainLayout = observer(
  ({ header, children, className }: MainLayoutProps) => {
    const { commonStore } = useContextStore();

    useHotkeys(
      [`${Key.Control}+${Key.Shift}+]`, `${Key.Meta}+${Key.Shift}+]`],
      (e) => {
        e.preventDefault();
        commonStore.update({ chatOpen: !commonStore.chatOpen });
      },
      {
        enableOnFormTags: true,
        scopes: [SCOPES.Global],
      },
    );

    return (
      <main className={cn('flex flex-col h-[100vh]', className)}>
        {header}
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            collapsible={false}
            order={1}
            id="app-layout"
            className="w-full"
          >
            {children}
          </ResizablePanel>
          {commonStore.chatOpen && (
            <>
              <ResizableHandle className="bg-transparent" />
              <ResizablePanel
                collapsible={false}
                maxSize={50}
                minSize={10}
                defaultSize={25}
                order={2}
                id="app-layout-chat"
              >
                <ContentBox className="pl-0">
                  <AI />
                </ContentBox>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </main>
    );
  },
);
