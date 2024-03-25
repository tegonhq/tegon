/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiSettings2Fill } from '@remixicon/react';
import { useRouter } from 'next/router';
import * as React from 'react';

import { cn } from 'common/lib/utils';
import { AllProviders } from 'common/wrappers/all-providers';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from 'components/ui/resizable';

import { Header } from './header';
import { Nav } from './nav';
import { TeamList } from './team-list';

interface LayoutProps {
  defaultCollapsed?: boolean;
  children: React.ReactNode;
}

export function AppLayout({ defaultCollapsed = false, children }: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const {
    query: { workspaceSlug },
  } = useRouter();

  return (
    <AllProviders>
      <div className="md:flex flex-col flex-grow">
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
            defaultSize={16}
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
                // {
                //   title: 'Inbox',
                //   icon: RiInbox2Fill,
                //   href: '/inbox',
                // },
                // {
                //   title: 'My issues',
                //   icon: RiFocusMode,
                //   href: `/${workspaceSlug}/my-issues`,
                // },
                {
                  title: 'Settings',
                  icon: RiSettings2Fill,
                  href: `/${workspaceSlug}/settings/overview`,
                },
              ]}
            />

            <TeamList isCollapsed={isCollapsed} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={30}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </AllProviders>
  );
}
