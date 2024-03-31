/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiArrowLeftSLine, RiGithubFill } from '@remixicon/react';
import { usePathname, useRouter } from 'next/navigation';

import { SettingsLayout } from 'common/layouts/settings-layout';

import { Button } from 'components/ui/button';

import { GithubOrganizationConnect } from './github-organization-connect';
import { GithubPersonalConnect } from './github-personal-connect';
import { RepoTeamLinks } from './repo-team-links';

export function Github() {
  const pathname = usePathname();
  const { push } = useRouter();

  return (
    <div className="flex flex-col w-full">
      <div className="hidden md:flex flex-shrink-0 h-[65px]"></div>
      <div className="flex items-start justify-center">
        <div className="max-w-[100%] md:max-w-[650px] w-full">
          <Button
            className="flex items-center text-sm px-0 !bg-transparent"
            variant="ghost"
            onClick={() => {
              push(pathname.replace('/github', ''));
            }}
          >
            <RiArrowLeftSLine size={14} className="mr-2" /> Integrations
          </Button>

          <div className="flex items-start gap-4 mt-6">
            <div className="border p-1 rounded-md bg-background">
              <RiGithubFill size={40} />
            </div>
            <div className="flex flex-col items-start">
              <div className="font-medium text-lg"> Github </div>
              <div className="text-muted-foreground text-base">
                Automate your pull request and commit workflows and keep issues
                synced both ways
              </div>
            </div>
          </div>

          <GithubPersonalConnect />
          <GithubOrganizationConnect />
          <RepoTeamLinks />
        </div>
      </div>
    </div>
  );
}

Github.getLayout = function getLayout(page: React.ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};
