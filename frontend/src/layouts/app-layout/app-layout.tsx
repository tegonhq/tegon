/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiFocusMode, RiInbox2Fill, RiSettings2Fill } from '@remixicon/react';
import { cn } from 'lib/utils';
import * as React from 'react';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from 'components/ui/resizable';
import { TooltipProvider } from 'components/ui/tooltip';
import { GetUserData } from 'components/wrappers/user-data';

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
        <GetUserData>
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
                    href: '/inbox',
                  },
                  {
                    title: 'My issues',
                    icon: RiFocusMode,
                    href: '/my-issues',
                  },
                  {
                    title: 'Settings',
                    icon: RiSettings2Fill,
                    href: '/settings',
                  },
                ]}
              />

              <TeamList isCollapsed={isCollapsed} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={30}>{children}</ResizablePanel>
          </ResizablePanelGroup>
        </GetUserData>
      </TooltipProvider>
    </div>
  );
}
