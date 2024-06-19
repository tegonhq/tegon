/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useRouter } from 'next/router';
import * as React from 'react';

import { SettingsLayout } from 'common/layouts/settings-layout';

import { Loader } from 'components/ui/loader';
import { ScrollArea } from 'components/ui/scroll-area';

import { UserContext } from 'store/user-context';
import { WorkspaceStoreInit } from 'store/workspace-store-provider';

import {
  SECTION_COMPONENTS,
  SECTION_TITLES,
  type SECTION_COMPONENTS_KEYS,
} from './personal-settings-constants';
import { Header } from '../header';

export function PersonalSettings() {
  const router = useRouter();
  const userData = React.useContext(UserContext);

  const settingsSection = router.query
    .settingsSection as SECTION_COMPONENTS_KEYS;
  const SectionComponent = settingsSection
    ? SECTION_COMPONENTS[settingsSection]
    : SECTION_COMPONENTS.profile;

  return (
    <div className="h-[100vh] flex flex-col w-full">
      <Header title={SECTION_TITLES[settingsSection]} />

      <ScrollArea className="flex grow bg-gray-200 rounded-tl-2xl">
        <div className="w-full p-6">
          {userData ? <SectionComponent /> : <Loader />}
        </div>
      </ScrollArea>
    </div>
  );
}

PersonalSettings.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SettingsLayout>
      <WorkspaceStoreInit>{page}</WorkspaceStoreInit>
    </SettingsLayout>
  );
};
