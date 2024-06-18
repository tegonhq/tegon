/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiArrowLeftSLine, RiGithubFill } from '@remixicon/react';
import { usePathname, useRouter } from 'next/navigation';

import { Header } from 'modules/settings/header';

import { SettingsLayout } from 'common/layouts/settings-layout';

import { Button } from 'components/ui/button';
import { ScrollArea } from 'components/ui/scroll-area';

import { GithubOrganizationConnect } from './github-organization-connect';
import { GithubPersonalConnect } from './github-personal-connect';
import { RepoTeamLinks } from './repo-team-links';
import { SettingSection } from 'modules/settings/setting-section';

export function Github() {
  const pathname = usePathname();
  const { push } = useRouter();

  return (
    <SettingSection
      title="Github"
      description="Automate your pull request and commit workflows and keep issues
    synced both ways"
    >
      <GithubPersonalConnect />
      <GithubOrganizationConnect />
      <RepoTeamLinks />
    </SettingSection>
  );
}

Github.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SettingsLayout>
      <div className="h-[100vh] flex flex-col w-full">
        <Header title="Overview" />
        <ScrollArea className="flex grow bg-gray-200 rounded-tl-2xl">
          <div className="w-full p-6">{page} </div>
        </ScrollArea>
      </div>
    </SettingsLayout>
  );
};
