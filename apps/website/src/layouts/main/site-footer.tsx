import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { RiGithubFill } from '@remixicon/react';
import { buttonVariants } from '@tegonhq/ui/components/button';
import { Separator } from '@tegonhq/ui/components/separator';
import { BookLine, CodingLine, SlackIcon } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import { siteConfig } from 'config/site';

import { ModeToggle } from './mode-toggle';

export function SiteFooter() {
  const { theme } = useTheme();

  return (
    <footer className="py-6 container ">
      <Separator className="my-2" />
      <div className="relative grid justify-center grid-cols-12 divide-x-0 pt-0 grid-rows-[1fr_auto] xl:mx-auto divide-y divide-grid-dimmed bg-visible-grid-2 sm:bg-visible-grid-4 lg:divide-y-0 lg:bg-visible-grid-6">
        <div className="pr-3 py-3 col-span-12 flex items-center justify-between lg:col-span-8 lg:flex lg:flex-col lg:items-start lg:bg-transparent">
          {theme === 'dark' ? (
            <Image
              src="/logo_white_text.svg"
              key={2}
              alt="logo"
              width={120}
              height={50}
            />
          ) : (
            <Image
              src="/logo_text.svg"
              key={2}
              alt="logo"
              width={120}
              height={50}
            />
          )}

          <div className="flex items-center gap-x-3">
            <div className="flex items-center gap-1">
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  'flex items-center gap-1',
                  buttonVariants({ variant: 'ghost' }),
                  '-ml-2',
                )}
              >
                <RiGithubFill />
              </Link>
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
              >
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
              </Link>

              <ModeToggle />
            </div>
          </div>
        </div>

        <div className="grid px-3 py-3 col-span-6 place-content-start gap-y-2 sm:col-span-3 lg:col-span-2">
          <h4 className="font-medium">Docs</h4>

          <a
            href="https://docs.tegon.ai"
            className="text-muted-foreground flex gap-1 items-center hover:text-foreground"
          >
            <BookLine size={14} />
            Introduction
          </a>
          <a
            href="https://docs.tegon.ai/quickstart"
            className="text-muted-foreground flex gap-1 items-center hover:text-foreground"
          >
            <BookLine size={14} />
            Quick start guide
          </a>
          <a
            href="https://docs.tegon.ai/oss/self-deployment"
            className="text-muted-foreground flex gap-1 items-center hover:text-foreground"
          >
            <BookLine size={14} />
            Self hosting
          </a>
        </div>
        <div className="grid px-3 py-3 col-span-6 place-content-start gap-y-2 sm:col-span-3 lg:col-span-2">
          <h4 className="font-medium">Developers</h4>

          <a
            href="https://docs.tegon.ai"
            className="text-muted-foreground flex gap-1 items-center hover:text-foreground"
          >
            <BookLine size={14} />
            Docs
          </a>
          <a
            href="https://github.com/tegonhq/tegon/blob/main/.github/CONTRIBUTING.md"
            className="text-muted-foreground flex gap-1 items-center hover:text-foreground"
          >
            <CodingLine size={14} />
            Contributing
          </a>
          <a
            href="https://github.com/tegonhq/tegon/blob/main/LICENSE"
            className="text-muted-foreground flex gap-1 items-center hover:text-foreground"
          >
            <CodingLine size={14} />
            Opensource
          </a>
          <a
            href="https://github.com/tegonhq/tegon"
            className="text-muted-foreground flex gap-1 items-center hover:text-foreground"
          >
            <GitHubLogoIcon className="h-3 w-3 mr- hover:text-foreground1" />
            Github
          </a>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by
          <a
            href={siteConfig.url}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 pl-1"
          >
            Tegon
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
