/* eslint-disable @next/next/no-img-element */
import type { User } from '@tegonhq/types';

import { RiAddLine } from '@remixicon/react';
import {
  useDeleteIntegrationAccount,
  useCreateRedirectURLMutation,
} from '@tegonhq/services/oauth';
import {
  type IntegrationAccountType,
  type Settings,
  IntegrationName,
} from '@tegonhq/types';
import { Button } from '@tegonhq/ui/components/button';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { useUsersData } from 'hooks/users';

import { useGithubAccounts } from './github-utils';

export const GithubOrganizationConnect = observer(() => {
  const { usersData, isLoading } = useUsersData();
  const { mutate: createRedirectURL, isLoading: redirectURLLoading } =
    useCreateRedirectURLMutation({
      onSuccess: (data) => {
        const redirectURL = data.redirectURL;

        window.open(redirectURL);
      },
    });

  const { githubAccounts, githubDefinition } = useGithubAccounts(
    IntegrationName.Github,
  );
  const { mutate: deleteIntegrationAccount, isLoading: deleting } =
    useDeleteIntegrationAccount({});

  function getUserData(userId: string) {
    return usersData.find((userData: User) => userData.id === userId);
  }

  if (isLoading) {
    return null;
  }

  return (
    <div className="mt-8 bg-background-3 rounded-md flex flex-col items-center justify-between">
      <div className="flex justify-between items-center w-full p-3 ">
        <div> Connected organizations </div>
        <div>
          <Button
            variant="ghost"
            isLoading={redirectURLLoading}
            onClick={() => {
              createRedirectURL({
                redirectURL: window.location.href,
                integrationDefinitionId: githubDefinition.id,
                workspaceId: githubDefinition.workspaceId,
              });
            }}
          >
            <RiAddLine size={16} />
          </Button>
        </div>
      </div>

      <div className={cn('w-full', githubAccounts.length > 0 && 'border-t')}>
        {githubAccounts.map(
          (githubAccount: IntegrationAccountType, index: number) => {
            const settings: Settings = JSON.parse(githubAccount.settings);

            return (
              <div
                className={cn(
                  'p-3 flex justify-between items-center',
                  index + 1 < githubAccounts.length && 'border-b',
                )}
                key={githubAccount.id}
              >
                <div className="flex items-center gap-2">
                  <div>
                    <img
                      width={32}
                      height={32}
                      src={settings.Github.orgAvatarURL}
                      alt="organization"
                    />
                  </div>
                  <div>
                    <p className="font-medium"> {settings.Github.orgLogin}</p>
                    <p className="text-muted-foreground">
                      Enabled by
                      <span className="mx-1">
                        {getUserData(githubAccount.integratedById).fullname}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      deleteIntegrationAccount({
                        integrationAccountId: githubAccount.id,
                      });
                    }}
                    isLoading={deleting}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
});
