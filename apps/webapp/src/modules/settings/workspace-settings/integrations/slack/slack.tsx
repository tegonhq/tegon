import { ScrollArea } from '@tegonhq/ui/components/scroll-area';

import { Header } from 'modules/settings/header';
import { SettingSection } from 'modules/settings/setting-section';

import { SettingsLayout } from 'common/layouts/settings-layout';

export function Slack() {
  return (
    <SettingSection
      title="Slack"
      description="Create issues from Slack messages and sync threads"
    >
      <h2> We are launching new workflow</h2>
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
