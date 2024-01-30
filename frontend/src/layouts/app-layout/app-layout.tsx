/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiInbox2Fill, RiSettings2Fill, RiTodoFill } from '@remixicon/react';
import { cn } from 'lib/utils';
import * as React from 'react';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from 'components/ui/resizable';
import { TooltipProvider } from 'components/ui/tooltip';

import { Header } from './header';
import { Nav } from './nav';
import { TeamList } from './team-list';

interface LayoutProps {
  defaultCollapsed?: boolean;
  children: React.ReactNode;
}

export function AppLayout({ defaultCollapsed = false, children }: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
    <div className="md:flex flex-col flex-grow">
      <TooltipProvider delayDuration={0}>
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
            collapsedSize={4}
            collapsible={true}
            minSize={4}
            maxSize={18}
            onExpand={() => {
              setIsCollapsed(false);
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                false,
              )}`;
            }}
            onCollapse={() => {
              setIsCollapsed(true);
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                true,
              )}`;
            }}
            className={cn(
              isCollapsed &&
                'min-w-[50px] transition-all duration-300 ease-in-out',
            )}
          >
            <Header isCollapsed={isCollapsed} />
            <Nav
              isCollapsed={isCollapsed}
              links={[
                {
                  title: 'Inbox',
                  icon: RiInbox2Fill,
                  variant: 'ghost',
                },
                {
                  title: 'My issues',
                  icon: RiTodoFill,
                  variant: 'ghost',
                },
                {
                  title: 'Settings',
                  icon: RiSettings2Fill,
                  variant: 'ghost',
                },
              ]}
            />

            <TeamList isCollapsed={isCollapsed} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={30}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </div>
  );
}
