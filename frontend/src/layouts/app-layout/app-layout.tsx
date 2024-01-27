/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { cn } from 'lib/utils';
import * as React from 'react';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from 'components/ui/resizable';
import { WorkspaceDropdown } from './workspace-dropdown';

interface LayoutProps {
  defaultCollapsed?: boolean;
  children: React.ReactNode;
}

export function AppLayout({ defaultCollapsed = false, children }: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
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
          defaultSize={12}
          collapsedSize={4}
          collapsible={true}
          minSize={4}
          maxSize={12}
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
          <WorkspaceDropdown />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={30}>{children}</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
