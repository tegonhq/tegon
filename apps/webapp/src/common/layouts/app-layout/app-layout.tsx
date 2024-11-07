import { Button } from '@tegonhq/ui/components/button';
import {
  Actions,
  Inbox,
  Project,
  SidebarLine,
  StackLine,
} from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import * as React from 'react';

import { GlobalShortcuts, IssueShortcutDialogs } from 'modules/shortcuts';

import { AllProviders } from 'common/wrappers/all-providers';

import { useCurrentTeam } from 'hooks/teams';
import { useCurrentWorkspace } from 'hooks/workspace';

import { useContextStore } from 'store/global-context-provider';

import { BottomBar } from './bottom-bar';
import { Nav } from './nav';
import { TeamList } from './team-list';
import { WorkspaceDropdown } from './workspace-dropdown';

interface LayoutProps {
  defaultCollapsed?: boolean;
  children: React.ReactNode;
}

export const AppLayoutChild = observer(({ children }: LayoutProps) => {
  const { applicationStore, notificationsStore } = useContextStore();
  const workspace = useCurrentWorkspace();

  const {
    query: { workspaceSlug },
  } = useRouter();
  const team = useCurrentTeam();

  const actionsLink = workspace.actionsEnabled
    ? [
        {
          title: 'Actions',
          icon: Actions,
          href: `/${workspaceSlug}/actions`,
        },
      ]
    : [];

  return (
    <>
      <div className="h-[100vh] w-[100vw] flex">
        {!applicationStore.sidebarCollapsed && (
          <div className="min-w-[220px] flex flex-col h-full overflow-auto">
            <div className="flex flex-col py-3 px-6">
              <div className="flex justify-between items-center">
                <WorkspaceDropdown />
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => applicationStore.updateSideBar(true)}
                >
                  <SidebarLine size={20} />
                </Button>
              </div>
            </div>
            <div className="px-6 mt-4 grow">
              <Nav
                links={[
                  {
                    title: 'Inbox',
                    icon: Inbox,
                    href: `/${workspaceSlug}/inbox`,
                    count: notificationsStore.unReadCount,
                  },
                  ...actionsLink,
                  {
                    title: 'Views',
                    icon: StackLine,
                    href: `/${workspaceSlug}/views`,
                  },
                  {
                    title: 'Projects',
                    icon: Project,
                    href: `/${workspaceSlug}/projects`,
                  },
                ]}
              />
              <TeamList />
            </div>
            <BottomBar />
          </div>
        )}

        <div
          className={cn(
            'w-full',
            applicationStore.sidebarCollapsed && 'max-w-[100vw]',
            !applicationStore.sidebarCollapsed && 'max-w-[calc(100vw_-_220px)]',
          )}
        >
          {children}
        </div>
      </div>

      <GlobalShortcuts />
      {team && <IssueShortcutDialogs />}
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
