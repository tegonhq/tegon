/** Copyright (c) 2024, Tegon, all rights reserved. **/

'use client';

import Link from 'next/link';

import { cn } from 'common/lib/utils';

import { buttonVariants } from 'components/ui/button';

interface NavProps {
  links: Array<{
    title: string;
    label?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    href: string;
  }>;
}

export function Nav({ links }: NavProps) {
  return (
    <div className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
      <nav className="grid gap-1 px-3">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'justify-start text-sm text-slate-700 dark:text-slate-300',
            )}
          >
            <link.icon className="mr-3 h-4 w-4 text-muted-foreground" />
            {link.title}
            {link.label && <span className={cn('ml-auto')}>{link.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
