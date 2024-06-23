/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiGithubFill } from '@remixicon/react';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { cn } from 'common/lib/utils';
import type {
  GithubRepositoryMappings,
  IntegrationAccountType,
  Settings,
} from 'common/types/integration-account';
import { IntegrationName } from 'common/types/integration-definition';
import type { TeamType } from 'common/types/team';

import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { Dialog } from 'components/ui/dialog';
import { TeamIcon } from 'components/ui/team-icon';
import { useToast } from 'components/ui/use-toast';
import { EditLine } from 'icons';

import { useUpdateIntegrationAccountMutation } from 'services/oauth';

import {
  DeleteRepoTeamLink,
  type GithubRepositoryMappingsWithAccount,
} from './delete-repo-team-link';
import { useGithubAccounts } from './github-utils';
import { RepoTeamLinkDialog } from './repo-team-link-dialog';

export const TeamRepoItems = observer(({ team }: { team: TeamType }) => {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const [accountToView, setAccountToView] = React.useState(undefined);

  const { githubAccounts } = useGithubAccounts(IntegrationName.Github);
  const { mutate: updateIntegrationAccount } =
    useUpdateIntegrationAccountMutation({
      onSuccess: () => {
        toast({
          title: 'Github settings updated!',
          description: 'Default repo is changed',
        });
      },
    });

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

  if (accounts.length === 0) {
    return null;
  }

  const onUpdate = (account: GithubRepositoryMappingsWithAccount) => {
    const integrationAccount = githubAccounts.find(
      (inAccount: IntegrationAccountType) =>
        inAccount.id === account.integrationAccountId,
    );
    const settings: Settings = JSON.parse(integrationAccount.settings);

    const repositoryMappings = settings.Github.repositoryMappings.map(
      (repoMap: GithubRepositoryMappings) => {
        return {
          ...repoMap,
          default: repoMap.githubRepoId === account.githubRepoId,
        };
      },
    );

    updateIntegrationAccount({
      integrationAccountId: account.integrationAccountId,
      settings: {
        ...settings,
        Github: {
          ...settings.Github,
          repositoryMappings,
        },
      },
    });
  };

  return (
    <div className="w-full">
      <div className="py-2 px-2 flex gap-2 bg-active/50 w-full rounded-md text-foreground items-center">
        <TeamIcon name={team.name} />
        {team.name} ({team.identifier})
      </div>

      <div className="mt-1">
        {accounts.map((account, index) => {
          return (
            <div
              key={account.githubRepoId}
              className={cn(
                'flex gap-2 items-center py-3 px-1 group min-h-[53px]',
                index + 1 < accounts.length && 'border-b',
              )}
            >
              <div className="border p-1 rounded-md bg-slate-100 dark:bg-slate-800">
                <RiGithubFill size={16} />
              </div>
              <div className="grow flex gap-2 items-center">
                <p>{account.githubRepoFullName}</p>{' '}
                {account.default && (
                  <Badge
                    variant="outline"
                    className="text-muted-foreground flex items-center"
                  >
                    default
                  </Badge>
                )}
              </div>
              <div className="hidden group-hover:flex">
                {!account.default && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      onUpdate(account);
                    }}
                  >
                    Make default
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setAccountToView(account);
                    setOpen(true);
                  }}
                >
                  <EditLine size={16} />
                </Button>
                <DeleteRepoTeamLink
                  account={account}
                  githubAccounts={githubAccounts}
                />
              </div>
            </div>
          );
        })}

        {accountToView && (
          <Dialog
            open={open}
            onOpenChange={(value) => {
              if (!value) {
                setAccountToView(undefined);
              }
              setOpen(value);
            }}
          >
            <RepoTeamLinkDialog
              defaultValues={{
                bidirectional: accountToView.bidirectional,
                teamId: accountToView.teamId,
                integrationAccountId: accountToView.integrationAccountId,
                githubRepoId: accountToView.githubRepoId,
              }}
              onClose={() => setOpen(false)}
            />
          </Dialog>
        )}
      </div>
    </div>
  );
});
