/** Copyright (c) 2024, Tegon, all rights reserved. **/
'use client';

import {
  RiAccountCircleFill,
  RiArrowLeftSLine,
  RiBuilding4Fill,
} from '@remixicon/react';
import { cn } from 'lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button, buttonVariants } from 'components/ui/button';

import { ACCOUNT_LINKS, WORKSPACE_LINKS } from './constants';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex flex-col', className)} {...props}>
      <Button
        variant="ghost"
        size="xl"
        className=" group px-3 py-4 text-lg bg-transparent hover:bg-transparent dark:hover:bg-transparent flex justify-start"
      >
        <RiArrowLeftSLine
          className="mr-4 text-gray-400 dark:text-gray-600 dark:group-hover:text-gray-500 group-hover:text-black"
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
                href={item.href}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'justify-start text-sm w-full px-2 text-gray-700 dark:text-gray-300',
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
                href={item.href}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'justify-start text-sm w-full px-2 text-gray-700 dark:text-gray-300',
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
