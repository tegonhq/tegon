/** Copyright (c) 2024, Tegon, all rights reserved. **/

'use client';

import { cn } from 'lib/utils';
import Link from 'next/link';

import { buttonVariants } from 'components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';

interface NavProps {
  isCollapsed: boolean;
  links: Array<{
    title: string;
    label?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    variant: 'default' | 'ghost';
  }>;
}

export function Nav({ links, isCollapsed }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className={cn(
                    buttonVariants({ variant: link.variant, size: 'icon' }),
                    'h-9 w-9 text-base px-1',
                    link.variant === 'default' &&
                      'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white',
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only text-base">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href="#"
              className={cn(
                buttonVariants({ variant: link.variant, size: 'sm' }),
                link.variant === 'default' &&
                  'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                'justify-start text-sm',
              )}
            >
              <link.icon className="mr-3 h-4 w-4 text-muted-foreground" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    'ml-auto',
                    link.variant === 'default' &&
                      'text-background dark:text-white',
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          ),
        )}
      </nav>
    </div>
  );
}
