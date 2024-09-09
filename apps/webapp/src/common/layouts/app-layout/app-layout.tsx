import type { ImperativePanelHandle } from '@tegonhq/ui/components/resizable';

import { Actions, DocumentLine, Inbox, SettingsLine } from '@tegonhq/ui/icons';
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
  const ref = React.useRef<ImperativePanelHandle>(null);

  React.useEffect(() => {
    if (!applicationStore.sidebarCollapsed) {
      const panel = ref.current;
      if (panel) {
        panel.expand();
      }
    }
  }, [applicationStore.sidebarCollapsed]);

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
        <div className="min-w-[220px] flex flex-col">
          <div className="flex flex-col py-4 px-6">
            <div className="flex justify-between items-center">
              <WorkspaceDropdown />
              {/* <Button
                variant="ghost"
                size="xs"
                onClick={() => applicationStore.updateSideBar(true)}
              >
                <SidebarLine size={20} />
              </Button> */}
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
                // {
                //   title: 'Notes',
                //   icon: DocumentLine,
                //   href: `/${workspaceSlug}/settings/overview`,
                // },
                ...actionsLink,
              ]}
            />
            <TeamList />
          </div>
          <BottomBar />
        </div>

        <div className="max-w-[calc(100vw_-_220px)] w-full">{children}</div>
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
