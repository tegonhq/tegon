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
    <nav className="grid gap-0.5">
      {links.map((link, index) => {
        const isActive = pathname.includes(link.href);

        return (
          <div className="flex gap-1 items-center " key={index}>
            <Link
              href={link.href}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'flex items-center gap-1 justify-between text-foreground bg-grayAlpha-100 w-fit',
                isActive && 'bg-active hover:bg-active',
              )}
            >
              <div className="flex items-center gap-1">
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.title}
                {link.label && (
                  <span className={cn('ml-auto')}>{link.label}</span>
                )}
              </div>
            </Link>
            {link.count > 0 && (
              <div className="h-6 flex items-center px-1 rounded text-xs bg-active">
                {link.count}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
