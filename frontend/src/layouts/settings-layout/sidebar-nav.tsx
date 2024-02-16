/** Copyright (c) 2024, Tegon, all rights reserved. **/
'use client';

import {
  RiAccountCircleFill,
  RiArrowLeftSLine,
  RiArrowRightSFill,
  RiBuilding4Fill,
  RiTeamFill,
} from '@remixicon/react';
import { cn } from 'lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/ui/accordion';
import { Button, buttonVariants } from 'components/ui/button';

import {
  ACCOUNT_LINKS,
  TEAM_LINKS,
  WORKSPACE_LINKS,
} from './settings-layout-constants';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const { query, replace } = useRouter();
  const { workspaceSlug, settingsSection = WORKSPACE_LINKS[0].href } = query;

  return (
    <nav className={cn('flex flex-col', className)} {...props}>
      <Button
        variant="ghost"
        size="xl"
        onClick={() => {
          replace(`/${query.workspaceSlug}`);
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
            <RiBuilding4Fill size={16} className="text-muted-foreground" />
            <div className="text-muted-foreground text-sm ml-4">Workspace</div>
          </div>

          <div className="pl-6 flex flex-col w-full">
            {WORKSPACE_LINKS.map((item) => (
              <Link
                key={item.href}
                href={`/${workspaceSlug}/settings/${item.href}`}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  settingsSection === item.href &&
                    'bg-slate-100 dark:bg-slate-800',
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
            <RiAccountCircleFill size={16} className="text-muted-foreground" />
            <div className="text-muted-foreground text-sm ml-4">My Account</div>
          </div>

          <div className="pl-6 flex flex-col w-full">
            {ACCOUNT_LINKS.map((item) => (
              <Link
                key={item.href}
                href={`/${workspaceSlug}/settings/${item.href}`}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
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
          <div className="flex items-center mb-2">
            <RiTeamFill size={16} className="text-muted-foreground" />
            <div className="text-muted-foreground text-sm ml-4">Teams</div>
          </div>

          <div className="pl-2 flex flex-col w-full">
            <Accordion
              type="single"
              collapsible
              defaultValue="item-1"
              className="w-full text-slate-700 dark:text-slate-300 mt-0"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-sm py-1 flex justify-between [&[data-state=open]>div>div>svg]:rotate-90 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 rounded-md">
                  <div className="w-full justify-start flex items-center">
                    <div className="flex justify-start items-center text-sm">
                      <RiArrowRightSFill className="arrow-right-icon mr-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                      Poozle
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-6 flex flex-col justify-center items-start w-full">
                  {TEAM_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={`/${workspaceSlug}/settings/${item.href}`}
                      className={cn(
                        buttonVariants({ variant: 'ghost', size: 'sm' }),
                        'justify-start text-sm w-full px-2 text-muted-foreground mt-1',
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </nav>
  );
}
