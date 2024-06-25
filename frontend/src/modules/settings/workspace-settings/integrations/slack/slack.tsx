/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Header } from 'modules/settings/header';
import { SettingSection } from 'modules/settings/setting-section';

import { SettingsLayout } from 'common/layouts/settings-layout';

import { ScrollArea } from 'components/ui/scroll-area';

import { SlackChannelConnext } from './slack-channel-connect';
import { SlackOrganizationConnect } from './slack-organization-connect';
import { SlackPersonalConnect } from './slack-personal-connect';

export function Slack() {
  return (
    <SettingSection
      title="Slack"
      description="Create issues from Slack messages and sync threads"
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
        <ScrollArea className="flex grow bg-background-2 rounded-tl-3xl">
          <div className="w-full p-6">{page} </div>
        </ScrollArea>
      </div>
    </SettingsLayout>
  );
};
