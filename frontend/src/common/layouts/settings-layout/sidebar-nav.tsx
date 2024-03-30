/** Copyright (c) 2024, Tegon, all rights reserved. **/
'use client';

import { RiArrowLeftSLine, RiBuilding4Fill } from '@remixicon/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import React from 'react';

import { cn } from 'common/lib/utils';

import { Button, buttonVariants } from 'components/ui/button';
import { AssigneeLine } from 'icons';

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
        className=" group px-3 py-4 text-lg bg-transparent hover:bg-transparent dark:hover:bg-transparent flex justify-start"
      >
        <RiArrowLeftSLine
          className="mr-4 text-slate-400 dark:text-slate-600 dark:group-hover:text-slate-500 group-hover:text-black"
          size={20}
        />
        Settings
      </Button>

      <div className="px-4 py-3">
        <div className="flex flex-col items-start justify-start w-full">
          <div className="flex items-center mb-1">
            <RiBuilding4Fill size={18} className="text-muted-foreground" />
            <div className="text-muted-foreground text-sm ml-4">Workspace</div>
          </div>

          <div className="pl-7 flex flex-col w-full">
            {WORKSPACE_LINKS.map((item) => (
              <Link
                key={item.href}
                href={`/${workspaceSlug}/settings/${item.href}`}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  !teamIdentifier &&
                    isActive(item) &&
                    'bg-slate-200 dark:bg-slate-800',

                  'justify-start text-sm w-full px-2 text-slate-700 dark:text-slate-300 mt-1',
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="flex flex-col items-start justify-start w-full">
          <div className="flex items-center mb-1">
            <AssigneeLine size={18} className="text-muted-foreground" />
            <div className="text-muted-foreground text-sm ml-4">My Account</div>
          </div>

          <div className="pl-7 flex flex-col w-full">
            {ACCOUNT_LINKS.map((item) => (
              <Link
                key={item.href}
                href={`/${workspaceSlug}/settings/account/${item.href}`}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),

                  settingsSection === item.href &&
                    'bg-slate-200 dark:bg-slate-800',
                  'justify-start text-sm w-full px-2 text-slate-700 dark:text-slate-300 mt-1',
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <TeamSettingsList />
    </nav>
  );
}
