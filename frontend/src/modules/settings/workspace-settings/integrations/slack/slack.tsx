/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiArrowLeftSLine } from '@remixicon/react';
import { usePathname, useRouter } from 'next/navigation';

import { SettingsLayout } from 'common/layouts/settings-layout';

import { Button } from 'components/ui/button';
import { ScrollArea } from 'components/ui/scroll-area';
import { SlackIcon } from 'icons';

import { SlackChannelConnext } from './slack-channel-connect';
import { SlackOrganizationConnect } from './slack-organization-connect';
import { SlackPersonalConnect } from './slack-personal-connect';

export function Slack() {
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
                push(pathname.replace('/slack', ''));
              }}
            >
              <RiArrowLeftSLine size={14} className="mr-2" /> Integrations
            </Button>

            <div className="flex items-start gap-4 mt-6">
              <div className="border p-1 rounded-md bg-background">
                <SlackIcon size={40} />
              </div>
              <div className="flex flex-col items-start">
                <div className="font-medium text-lg"> Slack </div>
                <div className="text-muted-foreground text-base">
                  Create issues from Slack messages and sync threads
                </div>
              </div>
            </div>

            <SlackPersonalConnect />
            <SlackOrganizationConnect />
            <SlackChannelConnext />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

Slack.getLayout = function getLayout(page: React.ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};
