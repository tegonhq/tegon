/** Copyright (c) 2024, Tegon, all rights reserved. **/
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  RiAccountBoxFill,
  RiDeleteBin7Fill,
  RiGithubFill,
  RiPencilFill,
} from '@remixicon/react';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Dialog, DialogTrigger } from 'components/ui/dialog';

import { cn } from 'common/lib/utils';
import type {
  GithubRepositoryMappings,
  IntegrationAccountType,
  Settings,
} from 'common/types/integration-account';
import { IntegrationName } from 'common/types/integration-definition';
import type { TeamType } from 'common/types/team';

import { Button } from 'components/ui/button';

import { useGithubAccounts } from './github-utils';
import { RepoTeamLinkDialog } from './repo-team-link-dialog';

interface GithubRepositoryMappingsWithAccount extends GithubRepositoryMappings {
  integrationAccountId: string;
}

export const TeamRepoItems = observer(({ team }: { team: TeamType }) => {
  const [open, setOpen] = React.useState(false);

  const { githubAccounts } = useGithubAccounts(IntegrationName.Github);
  const accounts = React.useMemo(() => {
    let accounts: GithubRepositoryMappingsWithAccount[] = [];
    githubAccounts.forEach((account: IntegrationAccountType) => {
      const settings: Settings = JSON.parse(account.settings);
      const teamAccounts = settings.Github.repositoryMappings
        .filter((repoMap) => repoMap.teamId === team.id)
        .map((repoMap) => ({ ...repoMap, integrationAccountId: account.id }));
      accounts = [...accounts, ...teamAccounts];
    });

    return accounts;
  }, [githubAccounts, team.id]);

  return (
    <div className="w-full">
      <div className="py-2 px-2 flex gap-2 bg-gray-100 dark:bg-gray-800 w-full rounded-md text-muted-foreground items-center">
        <RiAccountBoxFill size={16} />
        {team.name}
      </div>

      <div className="mt-3">
        {accounts.map((account, index) => {
          return (
            <div
              key={account.githubRepoId}
              className={cn(
                'flex gap-2 items-center py-3 px-1 group min-h-[53px]',
                index + 1 < accounts.length && 'border-b',
              )}
            >
              <div className="border p-1 rounded-md bg-gray-100 dark:bg-gray-800">
                <RiGithubFill size={16} />
              </div>
              <div className="grow">{account.githubRepoFullName}</div>
              <div className="hidden group-hover:flex gap-2">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <RiPencilFill
                        size={14}
                        className="text-muted-foreground"
                      />
                    </Button>
                  </DialogTrigger>
                  <RepoTeamLinkDialog
                    defaultValues={{
                      birectional: account.bidirectional,
                      teamId: account.teamId,
                      integrationAccountId: account.integrationAccountId,
                      githubRepoId: account.githubRepoId,
                    }}
                    onClose={() => setOpen(false)}
                  />
                </Dialog>

                <Button size="sm" variant="ghost">
                  <RiDeleteBin7Fill
                    size={14}
                    className="text-muted-foreground"
                  />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
