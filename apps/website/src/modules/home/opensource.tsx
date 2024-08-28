import { ArrowTopRightIcon, StarFilledIcon } from '@radix-ui/react-icons';
import { RiGithubFill } from '@remixicon/react';
import { buttonVariants } from '@tegonhq/ui/components/button';
import { CodingLine } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import { siteConfig } from 'config/site';
import Link from 'next/link';
import React from 'react';
import { formatNumber } from 'utils';

export function Opensource() {
  const [repoData, setRepoData] = React.useState(null);

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
    <div className="bg-background-2 my-16 rounded">
      <div className="flex justify-center item-center">
        <div className="mx-auto grid max-w-2xl place-items-center gap-2 px-4 py-24 md:gap-4 md:px-2 md:py-40 lg:px-0 text-md md:text-xl">
          <div>
            <RiGithubFill size={40} />
          </div>
          <div className="text-center">
            We love opensource. Tegon is AGPL-3.0 licensed so you can view
            source code, contribute and self host
          </div>
          <div className="flex gap-2">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className={cn(
                'flex items-center gap-1 text-md',
                buttonVariants({ variant: 'secondary' }),
              )}
            >
              <StarFilledIcon />
              {repoData && formatNumber(repoData.stargazers_count)}
              <ArrowTopRightIcon />
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className={cn(
                'flex items-center gap-1 text-md',
                buttonVariants({ variant: 'secondary' }),
              )}
            >
              <CodingLine />
              Contribute
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
