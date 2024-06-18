/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiArrowLeftSLine } from '@remixicon/react';
import { usePathname, useRouter } from 'next/navigation';

import { SettingsLayout } from 'common/layouts/settings-layout';

import { Button } from 'components/ui/button';
import { ScrollArea } from 'components/ui/scroll-area';
import { SentryIcon } from 'icons';

import { SentryConnect } from './sentry-connect';

export function Sentry() {
  const pathname = usePathname();
  const { push } = useRouter();

  return (
    <div className="h-[100vh] flex flex-col w-full">
      <ScrollArea>
        <div className="hidden md:flex flex-shrink-0 h-[65px]"></div>
        <div className="flex items-start justify-center pb-8">
          <div className="max-w-[100%] md:max-w-[650px] w-full">
            <Button
              className="flex items-center text-sm px-0 !bg-transparent"
              variant="ghost"
              onClick={() => {
                push(pathname.replace('/sentry', ''));
              }}
            >
              <RiArrowLeftSLine size={14} className="mr-2" /> Integrations
            </Button>

            <div className="flex items-start gap-4 mt-6">
              <div className="border p-1 rounded-md bg-background">
                <SentryIcon size={40} />
              </div>
              <div className="flex flex-col items-start">
                <div className="font-medium text-lg"> Sentry </div>
                <div className="text-muted-foreground text-base">
                  Connect sentry issues with tegon issues
                </div>
              </div>
            </div>

            <SentryConnect />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

Sentry.getLayout = function getLayout(page: React.ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};
