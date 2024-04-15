/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiArrowLeftSLine, RiSlackFill } from '@remixicon/react';
import { usePathname, useRouter } from 'next/navigation';

import { SettingsLayout } from 'common/layouts/settings-layout';

import { Button } from 'components/ui/button';

import { SlackChannelConnext } from './slack-channel-connect';
import { SlackOrganizationConnect } from './slack-organization-connect';
import { SlackPersonalConnect } from './slack-personal-connect';

export function Slack() {
  const pathname = usePathname();
  const { push } = useRouter();

  return (
    <div className="flex flex-col w-full">
      <div className="hidden md:flex flex-shrink-0 h-[65px]"></div>
      <div className="flex items-start justify-center">
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
              <RiSlackFill size={40} />
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
    </div>
  );
}

Slack.getLayout = function getLayout(page: React.ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};
