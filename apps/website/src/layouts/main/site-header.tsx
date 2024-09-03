import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import { RiGithubFill } from '@remixicon/react';
import { buttonVariants } from '@tegonhq/ui/components/button';
import { SlackIcon } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import { siteConfig } from 'config/site';
import { useState } from 'react';
import React from 'react';
import { formatNumber } from 'utils';

import { MainNav } from './main-nav';
import { MobileNav } from './mobile-nav';
import { ModeToggle } from './mode-toggle';

export function SiteHeader() {
  const [repoData, setRepoData] = useState(null);

  React.useEffect(() => {
    const fetchRepoData = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/tegonhq/tegon`,
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setRepoData(data);
      } catch (error) {}
    };

    fetchRepoData();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center gap-1">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className={cn(
                'flex items-center gap-1',
                buttonVariants({ variant: 'ghost' }),
              )}
            >
              <RiGithubFill />

              {repoData && formatNumber(repoData.stargazers_count)}
              <ArrowTopRightIcon />
            </a>
            <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
              <div
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'h-8 w-8 px-0',
                )}
              >
                <SlackIcon />
                <span className="sr-only">Slack</span>
              </div>
            </a>

            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
