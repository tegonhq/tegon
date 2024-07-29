import type {
  GithubRepositoryMappings,
  IntegrationAccountType,
  Settings,
} from '@tegonhq/types';
import type { TeamType } from '@tegonhq/types';

import { RiGithubFill } from '@remixicon/react';
import { useUpdateIntegrationAccountMutation } from '@tegonhq/services/oauth';
import { IntegrationName } from '@tegonhq/types';
import { Badge } from '@tegonhq/ui/components/badge';
import { Button } from '@tegonhq/ui/components/button';
import { Dialog } from '@tegonhq/ui/components/dialog';
import { TeamIcon } from '@tegonhq/ui/components/team-icon';
import { useToast } from '@tegonhq/ui/components/use-toast';
import { EditLine } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import React from 'react';

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
      <div className="py-2 px-2 flex gap-2 bg-accent/50 w-full rounded-md text-foreground items-center">
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
              <div className="border p-1 rounded-md">
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
                    variant="ghost"
                    onClick={() => {
                      onUpdate(account);
                    }}
                  >
                    Make default
                  </Button>
                )}
                <Button
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
