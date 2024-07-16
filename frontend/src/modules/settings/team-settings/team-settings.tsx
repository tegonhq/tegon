import { useRouter } from 'next/router';

import { SettingsLayout } from 'common/layouts/settings-layout';

import { Loader } from 'components/ui/loader';
import { ScrollArea } from 'components/ui/scroll-area';
import { useCurrentTeam } from 'hooks/teams/use-current-team';

import {
  type SECTION_COMPONENTS_KEYS,
  SECTION_COMPONENTS,
  SECTION_TITLES,
} from './team-constants';
import { Header } from '../header';

export function TeamSettings() {
  const router = useRouter();
  const currentTeam = useCurrentTeam();
  const settingsSection = router.query
    .settingsSection as SECTION_COMPONENTS_KEYS;
  const SectionComponent = settingsSection
    ? SECTION_COMPONENTS[settingsSection]
    : SECTION_COMPONENTS.overview;

  return (
    <div className="h-[100vh] flex flex-col w-full">
      <Header title={SECTION_TITLES[settingsSection]} />

      <ScrollArea className="flex grow bg-background-2 rounded-tl-3xl">
        <div className="w-full p-6">
          {currentTeam ? <SectionComponent /> : <Loader />}
        </div>
      </ScrollArea>
    </div>
  );
}

TeamSettings.getLayout = function getLayout(page: React.ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};
