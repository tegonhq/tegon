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

export const SlackPersonalConnect = observer(() => {
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
    integrationDefinition: slackDefinition,
    integrationAccount: slackAccount,
  } = useIntegrationAccount(IntegrationName.SlackPersonal, user.id);
  return (
    <div className="p-3 border text-sm rounded-md flex items-center justify-between">
      <div className="flex flex-col items-start justify-center">
        {slackAccount ? (
          <>
            <p className="font-medium"> Connected personal account</p>
            <p className="text-muted-foreground">
              Your personal slack account is connected
            </p>
          </>
        ) : (
          <>
            <p className="font-medium"> Connect personal account</p>
            <p className="text-muted-foreground">
              Connect your Slack account to use the integration
            </p>
          </>
        )}
      </div>

      <div>
        {slackAccount ? (
          <Button
            variant="destructive"
            onClick={() => {
              deleteIntegrationAccount({
                integrationAccountId: slackAccount.id,
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
                integrationDefinitionId: slackDefinition.id,
                workspaceId: slackDefinition.workspaceId,
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
