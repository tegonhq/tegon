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
    activePaths?: string[];
  }>;
}

export function checkIsActive(
  pathname: string,
  href: string,
  activePaths: string[],
): boolean {
  if (pathname.includes(href)) {
    return true;
  }

  if (activePaths && activePaths.length > 0) {
    return (
      activePaths.filter((path: string) => {
        return pathname.includes(path);
      }).length > 0
    );
  }

  return false;
}

export function Nav({ links }: NavProps) {
  const pathname = usePathname();

  return (
    <nav className="grid gap-0.5">
      {links.map((link, index) => {
        const isActive = checkIsActive(pathname, link.href, link.activePaths);

        return (
          <div className="flex gap-1 items-center " key={index}>
            <Link
              href={link.href}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'flex items-center gap-1 justify-between text-foreground bg-grayAlpha-100 w-fit',
                isActive && 'bg-accent text-accent-foreground',
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
              <div className="h-6 flex items-center px-1 rounded text-xs bg-accent text-accent-foreground">
                {link.count}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
