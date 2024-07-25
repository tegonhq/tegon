import { Button } from '@tegonhq/ui/components/button';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { IntegrationName } from 'common/types/integration-definition';

import {
  useCreateRedirectURLMutation,
  useDeleteIntegrationAccount,
} from 'services/oauth';

import { UserContext } from 'store/user-context';

import { useIntegrationAccount } from '../integration-util';

export const GithubPersonalConnect = observer(() => {
  const user = React.useContext(UserContext);
  const { mutate: createRedirectURL, isLoading: redirectURLLoading } =
    useCreateRedirectURLMutation({
      onSuccess: (data) => {
        const redirectURL = data.redirectURL;

        window.open(redirectURL);
      },
    });
  const { mutate: deleteIntegrationAccount, isLoading: deleting } =
    useDeleteIntegrationAccount({});

  const {
    integrationDefinition: githubDefinition,
    integrationAccount: githubAccount,
  } = useIntegrationAccount(IntegrationName.GithubPersonal, user.id);

  return (
    <div className="p-3 bg-background-3 rounded-md flex items-center justify-between">
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
