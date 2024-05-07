/** Copyright (c) 2024, Tegon, all rights reserved. **/

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from 'common/lib/utils';

import { buttonVariants } from 'components/ui/button';

interface NavProps {
  links: Array<{
    title: string;
    label?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: any;
    href: string;
    count?: number;
  }>;
}

export function Nav({ links }: NavProps) {
  const pathname = usePathname();

  return (
    <div className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
      <nav className="grid gap-1 px-3">
        {links.map((link, index) => {
          const isActive = pathname.includes(link.href);

          return (
            <Link
              key={index}
              href={link.href}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'text-sm text-slate-700 dark:text-slate-300 flex items-center justify-between pr-0',
                isActive &&
                  'bg-active text-slate-800 hover:bg-active dark:text-slate-100',
              )}
            >
              <div className="flex items-center">
                {link.icon && (
                  <link.icon className="mr-3 h-4 w-4 text-muted-foreground" />
                )}
                {link.title}
                {link.label && (
                  <span className={cn('ml-auto')}>{link.label}</span>
                )}
              </div>
              {link.count > 0 && (
                <div className="px-2 py-[2px] rounded-md text-xs bg-active text-foreground">
                  {link.count}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
