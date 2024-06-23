/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { RiDeleteBin7Fill } from '@remixicon/react';
import React from 'react';

import type {
  GithubRepositoryMappings,
  IntegrationAccountType,
  Settings,
} from 'common/types/integration-account';

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
} from 'components/ui/alert-dialog';
import { Button } from 'components/ui/button';
import { useToast } from 'components/ui/use-toast';

import { useUpdateIntegrationAccountMutation } from 'services/oauth';

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
        <Button size="sm" variant="ghost">
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
