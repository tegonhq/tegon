/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { AllProviders } from 'common/wrappers/all-providers';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from 'components/ui/resizable';
import { ScrollArea } from 'components/ui/scroll-area';

import { SideDrawer } from './side-sheet';
import { SidebarNav } from './sidebar-nav';

interface SettingsProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsProps) {
  return (
    <AllProviders>
      <div className="md:flex flex-col flex-grow">
        <div className="hidden md:block h-full">
          <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => {
              document.cookie = `react-resizable-panels:layout=${JSON.stringify(
                sizes,
              )}`;
            }}
            className="h-full max-h-[100%] items-stretch"
          >
            <ResizablePanel
              defaultSize={14}
              collapsible={false}
              minSize={14}
              maxSize={18}
            >
              <SidebarNav />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={30}>
              <div className="h-[100vh] flex flex-col w-full">
                <ScrollArea>{children}</ScrollArea>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        <SideDrawer />
        <div className="px-4 flex md:hidden pt-4 h-[100vh] flex-col w-full">
          <ScrollArea> {children} </ScrollArea>
        </div>
      </div>
    </AllProviders>
  );
}
