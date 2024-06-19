/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Header } from 'modules/settings/header';
import { SettingSection } from 'modules/settings/setting-section';

import { SettingsLayout } from 'common/layouts/settings-layout';

import { ScrollArea } from 'components/ui/scroll-area';

import { SentryConnect } from './sentry-connect';

export function Sentry() {
  return (
    <SettingSection
      title="Sentry"
      description="Connect sentry issues with tegon issues"
    >
      <SentryConnect />
    </SettingSection>
  );
}

Sentry.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SettingsLayout>
      <div className="h-[100vh] flex flex-col w-full">
        <Header title="Sentry" />
        <ScrollArea className="flex grow bg-gray-200 rounded-tl-2xl">
          <div className="w-full p-6">{page} </div>
        </ScrollArea>
      </div>
    </SettingsLayout>
  );
};
