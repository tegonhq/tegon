'use client';

import { buttonVariants } from '@tegonhq/ui/components/button';
import { cn } from '@tegonhq/ui/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface Link {
  title: string;
  label?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
  href: string;
  count?: number;
  strict?: boolean;
  activePaths?: string[];
}

interface NavProps {
  links: Link[];
}

export function checkIsActive(
  pathname: string,
  href: string,
  activePaths: string[],
  strict: boolean = false,
): boolean {
  if (strict) {
    return pathname.endsWith(href);
  }

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
        const isActive = checkIsActive(
          pathname,
          link.href,
          link.activePaths,
          link.strict,
        );

        return (
          <div className="flex gap-1 items-center " key={index}>
            <Link
              href={link.href}
              className={cn(
                buttonVariants({ variant: 'link' }),
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
