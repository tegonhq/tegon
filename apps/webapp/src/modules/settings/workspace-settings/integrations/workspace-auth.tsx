import type { IntegrationDefinition } from '@tegonhq/types';

import { Button } from '@tegonhq/ui/components/button';

import { useCurrentWorkspace } from 'hooks/workspace';

import {
  useCreateRedirectURLMutation,
  useDeleteIntegrationAccount,
} from 'services/oauth';

import { useIntegrationAccount } from './integration-util';

interface WorkspaceAuthProps {
  integrationDefinition: IntegrationDefinition;
}

export function WorkspaceAuth({ integrationDefinition }: WorkspaceAuthProps) {
  const workspace = useCurrentWorkspace();
  const integrationAccount = useIntegrationAccount(integrationDefinition.id);

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
            <p className="font-medium"> Connected organization account</p>
            <p className="text-muted-foreground">
              Your organization{' '}
              <span className="mx-1 font-medium">
                {integrationDefinition.name}
              </span>
              account is connected
            </p>
          </>
        ) : (
          <>
            <p className="font-medium"> Connect organization account</p>
            <p className="text-muted-foreground">
              Connect your {integrationDefinition.name} account to use the
              integration
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
}
