import { ScrollArea } from '@tegonhq/ui/components/scroll-area';

import { Header } from 'modules/settings/header';
import { SettingSection } from 'modules/settings/setting-section';

import { SettingsLayout } from 'common/layouts/settings-layout';

export function Github() {
  return (
    <SettingSection
      title="Github"
      description="Automate your pull request and commit workflows and keep issues
    synced both ways"
    >
      <h2>We are changing to new workflow</h2>
    </SettingSection>
  );
}

Github.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SettingsLayout>
      <div className="h-[100vh] flex flex-col w-full">
        <Header title="Github" />
        <ScrollArea className="flex grow bg-background-2 rounded-tl-3xl">
          <div className="w-full p-6">{page} </div>
        </ScrollArea>
      </div>
    </SettingsLayout>
  );
};
