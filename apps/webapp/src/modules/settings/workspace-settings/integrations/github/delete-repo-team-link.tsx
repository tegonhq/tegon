import type {
  GithubRepositoryMappings,
  IntegrationAccountType,
  Settings,
} from '@tegonhq/types';

import { RiDeleteBin7Fill } from '@remixicon/react';
import { useUpdateIntegrationAccountMutation } from '@tegonhq/services/oauth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@tegonhq/ui/components/alert-dialog';
import { Button } from '@tegonhq/ui/components/button';
import { useToast } from '@tegonhq/ui/components/use-toast';
import React from 'react';

export interface GithubRepositoryMappingsWithAccount
  extends GithubRepositoryMappings {
  integrationAccountId: string;
}

interface DeleteRepoTeamLinkProps {
  githubAccounts: IntegrationAccountType[];
  account: GithubRepositoryMappingsWithAccount;
}

export function DeleteRepoTeamLink({
  githubAccounts,
  account,
}: DeleteRepoTeamLinkProps) {
  const { toast } = useToast();

  const { mutate: updateIntegrationAccount } =
    useUpdateIntegrationAccountMutation({
      onSuccess: () => {
        toast({
          title: 'Github settings updated!',
          description:
            'Issues from github repo now will not be added to the team',
        });
      },
    });

  const onDelete = (account: GithubRepositoryMappingsWithAccount) => {
    const integrationAccount = githubAccounts.find(
      (inAccount: IntegrationAccountType) =>
        inAccount.id === account.integrationAccountId,
    );
    const settings: Settings = JSON.parse(integrationAccount.settings);

    const repositoryMappings = settings.Github.repositoryMappings.filter(
      (repoMap: GithubRepositoryMappings) =>
        repoMap.githubRepoId !== account.githubRepoId,
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
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="ghost">
          <RiDeleteBin7Fill size={14} className="text-muted-foreground" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onDelete(account)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
