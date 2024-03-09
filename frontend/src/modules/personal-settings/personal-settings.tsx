/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useRouter } from 'next/router';
import * as React from 'react';

import { SettingsLayout } from 'common/layouts/settings-layout';

import { Loader } from 'components/ui/loader';

import { UserContext } from 'store/user-context';
import { WorkspaceStoreProvider } from 'store/workspace-store-provider';

import {
  SECTION_COMPONENTS,
  type SECTION_COMPONENTS_KEYS,
} from './personal-settings-constants';

export function PersonalSettings() {
  const router = useRouter();
  const userData = React.useContext(UserContext);

  const settingsSection = router.query
    .settingsSection as SECTION_COMPONENTS_KEYS;
  const SectionComponent = settingsSection
    ? SECTION_COMPONENTS[settingsSection]
    : SECTION_COMPONENTS.profile;

  return (
    <div className="flex flex-col w-full">
      <div className="hidden md:flex flex-shrink-0 h-[65px]"></div>
      <div className="flex items-start justify-center">
        <div className="max-w-[100%] md:max-w-[650px] w-full">
          {userData ? <SectionComponent /> : <Loader />}
        </div>
      </div>
    </div>
  );
}

PersonalSettings.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SettingsLayout>
      <WorkspaceStoreProvider>{page}</WorkspaceStoreProvider>
    </SettingsLayout>
  );
};
