/* eslint-disable @next/next/no-img-element */
import {
  useDeleteIntegrationAccount,
  useCreateRedirectURLMutation,
} from '@tegonhq/services/oauth';
import { IntegrationName } from '@tegonhq/types';
import { Button } from '@tegonhq/ui/components/button';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { useIntegrationAccount } from '../integration-util';

export const SentryConnect = observer(() => {
  const { mutate: createRedirectURL, isLoading: redirectURLLoading } =
    useCreateRedirectURLMutation({
      onSuccess: (data) => {
        const redirectURL = data.redirectURL;

        window.open(redirectURL);
      },
    });

  const {
    integrationDefinition: sentryDefinition,
    integrationAccount: sentryAccount,
  } = useIntegrationAccount(IntegrationName.Sentry);

  const { mutate: deleteIntegrationAccount, isLoading: deleting } =
    useDeleteIntegrationAccount({});

  return (
    <div className="p-3 border text-sm rounded-md flex items-center justify-between">
      <div className="flex flex-col items-start justify-center">
        {sentryAccount ? (
          <>
            <p className="font-medium"> Connected sentry account</p>
            <p className="text-muted-foreground">
              Your sentry account is connected
            </p>
          </>
        ) : (
          <>
            <p className="font-medium"> Connect personal account</p>
            <p className="text-muted-foreground">
              Connect your account to use the integration
            </p>
          </>
        )}
      </div>

      <div>
        {sentryAccount ? (
          <Button
            variant="destructive"
            onClick={() => {
              deleteIntegrationAccount({
                integrationAccountId: sentryAccount.id,
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
                integrationDefinitionId: sentryDefinition.id,
                workspaceId: sentryDefinition.workspaceId,
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
