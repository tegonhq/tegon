/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import React from 'react';

import type { IntegrationAccountType } from 'common/types/integration-account';
import {
  IntegrationName,
  type IntegrationDefinitionType,
} from 'common/types/integration-definition';

import { Button } from 'components/ui/button';

import {
  useCreateRedirectURLMutation,
  useDeleteIntegrationAccount,
} from 'services/oauth';

import { useContextStore } from 'store/global-context-provider';
import { UserContext } from 'store/user-context';

export const GithubPersonalConnect = observer(() => {
  const {
    integrationDefinitionsStore: { integrationDefinitions },
    integrationAccountsStore: { integrationAccounts },
  } = useContextStore();
  const userData = React.useContext(UserContext);
  const { mutate: createRedirectURL, isLoading: redirectURLLoading } =
    useCreateRedirectURLMutation({
      onSuccess: (data) => {
        const redirectURL = data.redirectURL;

        window.open(redirectURL, '_blank');
      },
    });
  const { mutate: deleteIntegrationAccount, isLoading: deleting } =
    useDeleteIntegrationAccount({});

  const githubDefinition = React.useMemo(
    () =>
      integrationDefinitions.find(
        (integrationDefinition: IntegrationDefinitionType) =>
          integrationDefinition.name === IntegrationName.GithubPersonal,
      ),
    [integrationDefinitions],
  );

  const githubAccount = React.useMemo(
    () =>
      integrationAccounts.find(
        (integrationAccount: IntegrationAccountType) =>
          integrationAccount.integratedById === userData.id &&
          integrationAccount.integrationDefinitionId === githubDefinition.id,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [integrationAccounts],
  );

  return (
    <div className="mt-8 p-3 border text-sm rounded-md flex items-center justify-between">
      <div className="flex flex-col items-start justify-center">
        {githubAccount ? (
          <>
            <p className="font-medium"> Connected personal account</p>
            <p className="text-muted-foreground">
              Your personal github account is connected
            </p>
          </>
        ) : (
          <>
            <p className="font-medium"> Connect personal account</p>
            <p className="text-muted-foreground">
              Connect your Githubaccount to use the integration
            </p>
          </>
        )}
      </div>

      <div>
        {githubAccount ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              deleteIntegrationAccount({
                integrationAccountId: githubAccount.id,
              });
            }}
            isLoading={deleting}
          >
            Disconnect
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              createRedirectURL({
                redirectURL: window.location.href,
                integrationDefinitionId: githubDefinition.id,
                workspaceId: githubDefinition.workspaceId,
              });
            }}
            isLoading={redirectURLLoading}
          >
            Connect
          </Button>
        )}
      </div>
    </div>
  );
});
