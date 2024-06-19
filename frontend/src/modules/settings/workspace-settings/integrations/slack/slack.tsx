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
import { Header } from 'modules/settings/header';
import { SettingSection } from 'modules/settings/setting-section';

export function Slack() {
  const pathname = usePathname();
  const { push } = useRouter();

  return (
    <SettingSection
      title="Slack"
      description="  Create issues from Slack messages and sync threads"
    >
      <SlackPersonalConnect />
      <SlackOrganizationConnect />
      <SlackChannelConnext />
    </SettingSection>
  );
}

Slack.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SettingsLayout>
      <div className="h-[100vh] flex flex-col w-full">
        <Header title="Slack" />
        <ScrollArea className="flex grow bg-gray-200 rounded-tl-2xl">
          <div className="w-full p-6">{page} </div>
        </ScrollArea>
      </div>
    </SettingsLayout>
  );
};
