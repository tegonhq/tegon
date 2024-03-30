/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useRouter } from 'next/router';

import { SettingsLayout } from 'common/layouts/settings-layout';

import { Loader } from 'components/ui/loader';
import { useCurrentTeam } from 'hooks/teams/use-current-team';

import {
  type SECTION_COMPONENTS_KEYS,
  SECTION_COMPONENTS,
} from './team-constants';

export function TeamSettings() {
  const router = useRouter();
  const currentTeam = useCurrentTeam();
  const settingsSection = router.query
    .settingsSection as SECTION_COMPONENTS_KEYS;
  const SectionComponent = settingsSection
    ? SECTION_COMPONENTS[settingsSection]
    : SECTION_COMPONENTS.overview;

  return (
    <div className="flex flex-col w-full">
      <div className="hidden md:flex flex-shrink-0 h-[65px]"></div>
      <div className="flex items-start justify-center">
        <div className="max-w-[100%] md:max-w-[650px] w-full">
          {currentTeam ? <SectionComponent /> : <Loader />}
        </div>
      </div>
    </div>
  );
}

TeamSettings.getLayout = function getLayout(page: React.ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};
