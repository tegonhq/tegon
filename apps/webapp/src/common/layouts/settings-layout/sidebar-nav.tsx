'use client';

import { Button, buttonVariants } from '@tegonhq/ui/components/button';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { BuildingLine, ChevronLeft, UserLine } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import React from 'react';

import { useContextStore } from 'store/global-context-provider';

import {
  ACCOUNT_LINKS,
  WORKSPACE_LINKS,
  type LinkItem,
} from './settings-layout-constants';
import { TeamSettingsList } from './team-settings-list';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const router = useRouter();
  const { query, push } = router;
  const { teamsStore } = useContextStore();
  const pathname = usePathname();
  const {
    workspaceSlug,
    teamIdentifier,
    settingsSection = WORKSPACE_LINKS[0].href,
  } = query;

  function isActive(item: LinkItem) {
    if (pathname.includes('integrations')) {
      return pathname.includes(item.href);
    }

    return settingsSection === item.href;
  }

  return (
    <nav className={cn('flex flex-col', className)} {...props}>
      <Button
        variant="ghost"
        size="xl"
        onClick={() => {
          push(
            `/${query.workspaceSlug}/team/${teamsStore.teams[0].identifier}/all`,
          );
        }}
        className="group my-2 px-4 flex justify-start"
      >
        <ChevronLeft className="mr-2 " size={20} />
        Settings
      </Button>

      <ScrollArea className="overflow-y-auto h-[calc(100vh_-_56px)]">
        <div className="px-6 py-3">
          <div className="flex flex-col items-start justify-start w-full">
            <div className="flex items-center mb-1">
              <BuildingLine size={20} />
              <div className="ml-1">Workspace</div>
            </div>

            <div className="flex flex-col w-full gap-0.5">
              {WORKSPACE_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={`/${workspaceSlug}/settings/${item.href}`}
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'flex items-center justify-start text-foreground bg-grayAlpha-100 w-fit',
                    !teamIdentifier &&
                      isActive(item) &&
                      'bg-accent text-accent-foreground',
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-3">
          <div className="flex flex-col items-start justify-start w-full">
            <div className="flex items-center mb-1">
              <UserLine size={20} />
              <div className="ml-1">My Account</div>
            </div>

            <div className="flex flex-col w-full gap-0.5">
              {ACCOUNT_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={`/${workspaceSlug}/settings/account/${item.href}`}
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'flex items-center justify-start text-foreground bg-grayAlpha-100 w-fit',

                    settingsSection === item.href &&
                      'bg-accent text-accent-foreground',
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <TeamSettingsList />
      </ScrollArea>
    </nav>
  );
}
