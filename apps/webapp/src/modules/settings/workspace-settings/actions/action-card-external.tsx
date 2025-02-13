import { Button } from '@tegonhq/ui/components/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@tegonhq/ui/components/card';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';

import { useCurrentWorkspace } from 'hooks/workspace';

import type { ActionExternalConfig } from 'services/action';
import { useCreateActionMutation } from 'services/action/create-action';

interface ActionCardProps {
  action: ActionExternalConfig;
}

export const ActionCardExternal = observer(({ action }: ActionCardProps) => {
  const workspace = useCurrentWorkspace();
  const { isLoading, mutate: createActionAPI } = useCreateActionMutation({});
  const { push } = useRouter();

  const createAction = () => {
    const { version, ...config } = action;

    createActionAPI(
      {
        config,
        version,
      },
      {
        onSuccess: () => {
          push(`/${workspace.slug}/settings/actions/${action.slug}`);
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">{action.name}</CardTitle>
        <CardDescription>{action.description}</CardDescription>
      </CardHeader>

      <CardFooter className="flex justify-end">
        <Button
          variant="secondary"
          isLoading={isLoading}
          onClick={createAction}
        >
          Install
        </Button>
      </CardFooter>
    </Card>
  );
});
