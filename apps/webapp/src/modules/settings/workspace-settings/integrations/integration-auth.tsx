import type { IntegrationDefinition } from '@tegonhq/types';

import { Button } from '@tegonhq/ui/components/button';
import { observer } from 'mobx-react-lite';

import { useCurrentWorkspace } from 'hooks/workspace';

import {
  useCreateRedirectURLMutation,
  useDeleteIntegrationAccount,
} from 'services/oauth';

import { useIntegrationAccount } from './integration-util';

interface IntegrationAuthProps {
  integrationDefinition: IntegrationDefinition;
  personal?: boolean;
}

export const IntegrationAuth = observer(
  ({ integrationDefinition, personal }: IntegrationAuthProps) => {
    const workspace = useCurrentWorkspace();
    const integrationAccount = useIntegrationAccount(
      integrationDefinition.id,
      personal,
    );

    const { mutate: createRedirectURL, isLoading: redirectURLLoading } =
      useCreateRedirectURLMutation({
        onSuccess: (data) => {
          const redirectURL = data.redirectURL;

          window.open(redirectURL);
        },
      });

    const { mutate: deleteIntegrationAccount, isLoading: deleting } =
      useDeleteIntegrationAccount({});

    return (
      <div className="p-3 border rounded bg-background-3 flex items-center justify-between">
        <div className="flex flex-col items-start justify-center">
          {integrationAccount ? (
            <>
              <p className="font-medium">
                Connected {personal ? 'Personal' : 'Organisation'} account
              </p>
              <p className="text-muted-foreground">
                {personal ? (
                  <>
                    Your personal
                    <span className="mx-1 font-medium">
                      {integrationDefinition.name}
                    </span>
                    account is connected
                  </>
                ) : (
                  <>
                    Your organization
                    <span className="mx-1 font-medium">
                      {integrationDefinition.name}
                    </span>
                    account is connected
                  </>
                )}
              </p>
            </>
          ) : (
            <>
              <p className="font-medium">
                Connect {personal ? 'Personal' : 'Organisation'} account
              </p>
              <p className="text-muted-foreground">
                {personal
                  ? `Connect your personal ${integrationDefinition.name} account to use the
                integration`
                  : `Connect your ${integrationDefinition.name} account to use the
                integration`}
              </p>
            </>
          )}
        </div>

        <div>
          {integrationAccount ? (
            <Button
              variant="destructive"
              onClick={() => {
                deleteIntegrationAccount({
                  integrationAccountId: integrationAccount.id,
                });
              }}
              isLoading={deleting}
            >
              Disconnect
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                createRedirectURL({
                  redirectURL: window.location.href,
                  integrationDefinitionId: integrationDefinition.id,
                  workspaceId: workspace.id,
                  personal,
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
  },
);
