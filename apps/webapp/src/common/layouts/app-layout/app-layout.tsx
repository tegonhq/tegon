import { Inbox, MyIssues, Project, StackLine } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import * as React from 'react';

import { NewIssueProvider } from 'modules/issues/new-issue';
import { GlobalShortcuts, IssueShortcutDialogs } from 'modules/shortcuts';

import { AllProviders } from 'common/wrappers/all-providers';

import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { BottomBar } from './bottom-bar';
import { Header } from './header';
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

  return (
    <>
      <div className="h-[100vh] w-[100vw] flex">
        {!applicationStore.sidebarCollapsed && (
          <div className="min-w-[220px] flex flex-col h-full overflow-auto">
            <div className="flex py-3 px-4 pr-2 items-center justify-between">
              <WorkspaceDropdown />
              <Header />
            </div>

            <div className="px-4 pr-2 mt-4 grow">
              <Nav
                links={[
                  {
                    title: 'Inbox',
                    icon: Inbox,
                    href: `/${workspaceSlug}/inbox`,
                    count: notificationsStore.unReadCount,
                  },
                  {
                    title: 'My issues',
                    icon: MyIssues,
                    href: `/${workspaceSlug}/my-issues`,
                  },
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
                  {
                    title: 'Teams',
                    icon: Project,
                    href: `/${workspaceSlug}/teams`,
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
      <NewIssueProvider>
        <AppLayoutChild {...props} />
      </NewIssueProvider>
    </AllProviders>
  );
}
