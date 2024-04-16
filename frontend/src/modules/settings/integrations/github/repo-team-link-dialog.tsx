/* eslint-disable @next/next/no-img-element */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { zodResolver } from '@hookform/resolvers/zod';
import { RiGithubFill } from '@remixicon/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from 'common/lib/utils';
import type {
  GithubRepositories,
  IntegrationAccountType,
  Settings,
} from 'common/types/integration-account';
import { IntegrationName } from 'common/types/integration-definition';
import type { TeamType } from 'common/types/team';

import { Button } from 'components/ui/button';
import { DialogContent, DialogHeader, DialogTitle } from 'components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from 'components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { Switch } from 'components/ui/switch';
import { useToast } from 'components/ui/use-toast';
import { useTeams } from 'hooks/teams';
import { TeamLine } from 'icons';

import { useUpdateIntegrationAccountMutation } from 'services/oauth';

import { useGithubAccounts } from './github-utils';

const RepoTeamLinkSchema = z.object({
  teamId: z.string(),
  githubRepoId: z.string(),
  bidirectional: z.boolean(),
  integrationAccountId: z.string(),
});

interface ValuesType {
  teamId?: string;
  githubRepoId?: string;
  bidirectional?: boolean;
  integrationAccountId?: string;
}

interface RepoTeamLinkDialogProps {
  defaultValues: ValuesType;
  onClose: () => void;
}

export function RepoTeamLinkDialog({
  defaultValues,
  onClose,
}: RepoTeamLinkDialogProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof RepoTeamLinkSchema>>({
    resolver: zodResolver(RepoTeamLinkSchema),
    defaultValues: {
      bidirectional: false,
      ...defaultValues,
    },
  });
  const teams = useTeams();
  const { githubAccounts } = useGithubAccounts(IntegrationName.Github);
  const { mutate: updateIntegrationAccount, isLoading } =
    useUpdateIntegrationAccountMutation({
      onSuccess: () => {
        toast({
          title: 'Github settings updated!',
          description: 'Issues from github repo now will be added to the team',
        });
        form.reset();
        onClose();
      },
    });

  const getGithubAccount = (accountId: string) => {
    return githubAccounts.find(
      (account: IntegrationAccountType) => account.id === accountId,
    );
  };

  const onSubmit = (values: ValuesType) => {
    const integrationAccount = getGithubAccount(values.integrationAccountId);
    const settings: Settings = JSON.parse(integrationAccount.settings);
    const indexToUpdate = settings.Github.repositoryMappings.findIndex(
      (mapping) => mapping.githubRepoId === defaultValues.githubRepoId,
    );
    const repository = settings.Github.repositories.find(
      (repository) => `${repository.id}` === values.githubRepoId,
    );

    let repositoryMappings = settings.Github.repositoryMappings;
    if (repositoryMappings.length === 0) {
      repositoryMappings = [
        {
          teamId: values.teamId,
          default: true,
          githubRepoId: values.githubRepoId,
          bidirectional: values.bidirectional,
          githubRepoFullName: repository.fullName,
        },
      ];
    } else if (indexToUpdate > -1) {
      repositoryMappings[indexToUpdate] = {
        ...repositoryMappings[indexToUpdate],
        teamId: values.teamId,
        githubRepoId: values.githubRepoId,
        bidirectional: values.bidirectional,
        githubRepoFullName: repository.fullName,
      };
    } else {
      repositoryMappings.push({
        teamId: values.teamId,
        githubRepoId: values.githubRepoId,
        bidirectional: values.bidirectional,
        githubRepoFullName: repository.fullName,
        default: false,
      });
    }

    updateIntegrationAccount({
      integrationAccountId: values.integrationAccountId,
      settings: {
        ...settings,
        Github: {
          ...settings.Github,
          repositoryMappings,
        },
      },
    });
  };

  const formValues = form.getValues();

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader className="p-4 border-b">
        <DialogTitle className="text-sm font-normal">
          <div className="flex gap-1 items-center text-md">
            Link GitHub repo to Team
          </div>
        </DialogTitle>
      </DialogHeader>

      <div className="p-4 text-sm pt-0">
        <div className="text-muted-foreground">
          Choose a GitHub repository to link to team. Issues will be synced
          between the two
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mt-4">
              <FormField
                control={form.control}
                name="integrationAccountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={cn(
                            'h-[30px]',
                            field.value
                              ? 'text-foreground'
                              : 'text-muted-foreground',
                          )}
                        >
                          <SelectValue placeholder="Select a organization" />
                        </SelectTrigger>
                        <SelectContent className="text-sm">
                          <SelectGroup>
                            {githubAccounts.map(
                              (githubAccount: IntegrationAccountType) => {
                                const settings: Settings = JSON.parse(
                                  githubAccount.settings,
                                );
                                return (
                                  <SelectItem
                                    value={githubAccount.id}
                                    key={githubAccount.id}
                                  >
                                    <div className="flex gap-2">
                                      <img
                                        width={20}
                                        height={20}
                                        src={settings.Github.orgAvatarURL}
                                        alt="organization"
                                      />
                                      <p>{settings.Github.orgLogin}</p>
                                    </div>
                                  </SelectItem>
                                );
                              },
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="githubRepoId"
                render={({ field }) => {
                  let repositories: GithubRepositories[] = [];
                  const integrationAccount = getGithubAccount(
                    formValues.integrationAccountId,
                  );
                  if (integrationAccount) {
                    const settings: Settings = JSON.parse(
                      integrationAccount.settings,
                    );

                    repositories = settings.Github.repositories.filter(
                      (repo) =>
                        settings.Github.repositoryMappings.filter(
                          (repoMap) => repoMap.githubRepoId === `${repo.id}`,
                        ).length === 0 ||
                        defaultValues.githubRepoId === `${repo.id}`,
                    );
                  }

                  return (
                    <FormItem className="mt-4">
                      <FormLabel>Repository</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className={cn(
                              'h-[30px]',
                              field.value
                                ? 'text-foreground'
                                : 'text-muted-foreground',
                            )}
                          >
                            <SelectValue placeholder="Select a repository" />
                          </SelectTrigger>
                          <SelectContent className="text-sm">
                            <SelectGroup>
                              {repositories.map(
                                (repository: GithubRepositories) => {
                                  return (
                                    <SelectItem
                                      value={`${repository.id}`}
                                      key={repository.id}
                                    >
                                      <div className="flex gap-2 items-center">
                                        <RiGithubFill size={16} />
                                        {repository.fullName}
                                      </div>
                                    </SelectItem>
                                  );
                                },
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="teamId"
                render={({ field }) => {
                  return (
                    <FormItem className="mt-4">
                      <FormLabel>Team</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className={cn(
                              'h-[30px]',
                              field.value
                                ? 'text-foreground'
                                : 'text-muted-foreground',
                            )}
                          >
                            <SelectValue placeholder="Select a team" />
                          </SelectTrigger>
                          <SelectContent className="text-sm">
                            <SelectGroup>
                              {teams.map((team: TeamType) => {
                                return (
                                  <SelectItem
                                    value={`${team.id}`}
                                    key={team.id}
                                  >
                                    <div className="flex gap-2 items-center">
                                      <TeamLine
                                        size={16}
                                        className="text-muted-foreground"
                                      />
                                      {team.name}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="bidirectional"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg mt-4">
                    <div className="space-y-0.5">
                      <FormLabel>Enable bidirectional sync</FormLabel>
                      <FormDescription className="max-w-[calc(100%_-_100px)]">
                        When enabled, issues created in Tegon will also sync to
                        Github. Otherwise only issues created in GitHub will
                        sync to Tegon
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-readonly
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex items-end justify-end mt-4">
                <Button variant="outline" size="sm" isLoading={isLoading}>
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
}
