/* eslint-disable @next/next/no-img-element */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiAddLine } from '@remixicon/react';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { cn } from 'common/lib/utils';
import type {
  IntegrationAccountType,
  Settings,
} from 'common/types/integration-account';
import { IntegrationName } from 'common/types/integration-definition';

import { Button } from 'components/ui/button';
import { useUsersData } from 'hooks/users';

import { useDeleteIntegrationAccount } from 'services/oauth';
import { useCreateRedirectURLMutation } from 'services/oauth/create-redirect-url';

import type { User } from 'store/user-context';

import { useIntegrationAccounts } from '../integration-util';

export const GithubOrganizationConnect = observer(() => {
  const { usersData, isLoading } = useUsersData();
  const { mutate: createRedirectURL, isLoading: redirectURLLoading } =
    useCreateRedirectURLMutation({
      onSuccess: (data) => {
        const redirectURL = data.redirectURL;

        window.open(redirectURL);
      },
    });

  const {
    integrationAccountsForName: sentryAccounts,
    integrationDefinition: sentryDefinition,
  } = useIntegrationAccounts(IntegrationName.Sentry);
  const { mutate: deleteIntegrationAccount, isLoading: deleting } =
    useDeleteIntegrationAccount({});

  function getUserData(userId: string) {
    return usersData.find((userData: User) => userData.id === userId);
  }

  if (isLoading) {
    return null;
  }

  return (
    <div className="mt-8 border text-sm rounded-md flex flex-col items-center justify-between">
      <div className="flex justify-between items-center w-full p-3 ">
        <div> Connected organizations </div>
        <div>
          <Button
            variant="ghost"
            size="sm"
            isLoading={redirectURLLoading}
            onClick={() => {
              createRedirectURL({
                redirectURL: window.location.href,
                integrationDefinitionId: sentryDefinition.id,
                workspaceId: sentryDefinition.workspaceId,
              });
            }}
          >
            <RiAddLine size={16} />
          </Button>
        </div>
      </div>

      <div className={cn('w-full', sentryAccounts.length > 0 && 'border-t')}>
        {sentryAccounts.map(
          (sentryAccount: IntegrationAccountType, index: number) => {
            const settings: Settings = JSON.parse(sentryAccount.settings);

            return (
              <div
                className={cn(
                  'p-3 flex justify-between items-center',
                  index + 1 < sentryAccounts.length && 'border-b',
                )}
                key={sentryAccount.id}
              >
                <div className="flex items-center gap-2">
                  <div>
                    <img
                      width={32}
                      height={32}
                      src={settings.Sentry.orgAvatarURL}
                      alt="organization"
                    />
                  </div>
                  <div>
                    <p className="font-medium"> {settings.Sentry.orgLogin}</p>
                    <p className="text-muted-foreground">
                      Enabled by
                      <span className="mx-1">
                        {getUserData(sentryAccount.integratedById).fullname}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      deleteIntegrationAccount({
                        integrationAccountId: sentryAccount.id,
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
