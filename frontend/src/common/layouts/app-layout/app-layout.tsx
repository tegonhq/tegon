/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { ImperativePanelHandle } from 'react-resizable-panels';

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import * as React from 'react';

import { ShortcutDialogs } from 'modules/shortcuts';

import { cn } from 'common/lib/utils';
import { AllProviders } from 'common/wrappers/all-providers';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from 'components/ui/resizable';
import { useCurrentTeam } from 'hooks/teams';
import { Inbox, SettingsLine } from 'icons';

import { useContextStore } from 'store/global-context-provider';

import { Header } from './header';
import { Nav } from './nav';
import { TeamList } from './team-list';

interface LayoutProps {
  defaultCollapsed?: boolean;
  children: React.ReactNode;
}

export const AppLayoutChild = observer(({ children }: LayoutProps) => {
  const { applicationStore, notificationsStore } = useContextStore();
  const isCollapsed = applicationStore.sidebarCollapsed;
  const {
    query: { workspaceSlug },
  } = useRouter();
  const team = useCurrentTeam();
  const ref = React.useRef<ImperativePanelHandle>(null);

  React.useEffect(() => {
    if (!applicationStore.sidebarCollapsed) {
      const panel = ref.current;
      if (panel) {
        panel.expand();
      }
    }
  }, [applicationStore.sidebarCollapsed]);

  return (
    <div className="md:flex flex-col flex-grow">
      <div className="hidden md:block h-full">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full max-h-[100vh] items-stretch max-w-[100vw]"
        >
          <ResizablePanel
            defaultSize={14}
            collapsible
            ref={ref}
            collapsedSize={0}
            minSize={14}
            maxSize={14}
            onExpand={() => {
              applicationStore.updateSideBar(false);
            }}
            onCollapse={() => {
              applicationStore.updateSideBar(true);
            }}
            className={cn(
              isCollapsed && 'transition-all duration-300 ease-in-out',
            )}
          >
            {!isCollapsed && (
              <>
                <Header />
                <Nav
                  links={[
                    {
                      title: 'Inbox',
                      icon: Inbox,
                      href: `/${workspaceSlug}/inbox`,
                      count: notificationsStore.unReadCount,
                    },

                    {
                      title: 'Settings',
                      icon: SettingsLine,
                      href: `/${workspaceSlug}/settings/overview`,
                    },
                  ]}
                />

                <TeamList />
              </>
            )}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={30}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className="px-4 flex md:hidden pt-4"> {children} </div>
      {team && <ShortcutDialogs />}
    </div>
  );
});

export function AppLayout(props: LayoutProps) {
  return (
    <AllProviders>
      <AppLayoutChild {...props} />
    </AllProviders>
  );
}
