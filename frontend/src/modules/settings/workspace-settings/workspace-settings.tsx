/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useRouter } from 'next/router';

import { SettingsLayout } from 'common/layouts/settings-layout';

import { ScrollArea } from 'components/ui/scroll-area';

import {
  type SECTION_COMPONENTS_KEYS,
  SECTION_COMPONENTS,
  SECTION_TITLES,
} from './workspace-settings-constants';
import { Header } from '../header';

export function WorkspaceSettings() {
  const router = useRouter();
  const settingsSection = router.query
    .settingsSection as SECTION_COMPONENTS_KEYS;
  const SectionComponent = settingsSection
    ? SECTION_COMPONENTS[settingsSection]
    : SECTION_COMPONENTS.overview;

  return (
    <div className="h-[100vh] flex flex-col w-full">
      <Header title={SECTION_TITLES[settingsSection]} />
      <ScrollArea className="flex grow bg-gray-200 rounded-tl-2xl">
        <div className="w-full p-6">
          <SectionComponent />
        </div>
      </ScrollArea>
    </div>
  );
}

WorkspaceSettings.getLayout = function getLayout(page: React.ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};
