/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { ImperativePanelHandle } from 'react-resizable-panels';

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import * as React from 'react';

import { ShortcutDialogs } from 'modules/shortcuts';

import { AllProviders } from 'common/wrappers/all-providers';

import { Button } from 'components/ui/button';
import { useCurrentTeam } from 'hooks/teams';
import { Inbox, SettingsLine, SidebarLine } from 'icons';

import { useContextStore } from 'store/global-context-provider';

import { Nav } from './nav';
import { TeamList } from './team-list';
import { WorkspaceDropdown } from './workspace-dropdown';

interface LayoutProps {
  defaultCollapsed?: boolean;
  children: React.ReactNode;
}

export const AppLayoutChild = observer(({ children }: LayoutProps) => {
  const { applicationStore, notificationsStore } = useContextStore();

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
    <>
      <div className="h-[100vh] w-[100vw] flex">
        <div className="min-w-[234px]">
          <div className="flex flex-col py-4 px-6">
            <div className="flex justify-between items-center">
              <WorkspaceDropdown />
              <Button
                variant="ghost"
                size="xs"
                onClick={() => applicationStore.updateSideBar(true)}
              >
                <SidebarLine size={20} />
              </Button>
            </div>
          </div>
          <div className="px-6 mt-4">
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
          </div>
        </div>

        <div className="max-w-[calc(100vw_-_234px)] w-full">{children}</div>
      </div>

      {team && <ShortcutDialogs />}
    </>
  );
});

export function AppLayout(props: LayoutProps) {
  return (
    <AllProviders>
      <AppLayoutChild {...props} />
    </AllProviders>
  );
}
