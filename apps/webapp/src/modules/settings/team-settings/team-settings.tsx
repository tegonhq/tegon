import { Loader } from '@tegonhq/ui/components/loader';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { useRouter } from 'next/router';

import { ContentBox } from 'common/layouts/content-box';
import { SettingsLayout } from 'common/layouts/settings-layout';

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

      <ContentBox>
        <ScrollArea className="flex grow h-full">
          <div className="w-full p-4">
            {currentTeam ? <SectionComponent /> : <Loader />}
          </div>
        </ScrollArea>
      </ContentBox>
    </div>
  );
}

TeamSettings.getLayout = function getLayout(page: React.ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};
