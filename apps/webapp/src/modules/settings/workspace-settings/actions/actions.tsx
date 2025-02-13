import type { ActionConfig } from '@tegonhq/types';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@tegonhq/ui/components/card';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { AddLine } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';

import { Header } from 'modules/settings/header';

import { ContentBox } from 'common/layouts/content-box';
import { SettingsLayout } from 'common/layouts/settings-layout';
import type { ActionType } from 'common/types';

import {
  useGetAllActionsQuery,
  type ActionExternalConfig,
} from 'services/action';

import { useContextStore } from 'store/global-context-provider';

import { ActionCard } from './action-card';
import { ActionCardExternal } from './action-card-external';

export const Actions = observer(() => {
  const { actionsStore } = useContextStore();
  const actions = actionsStore.allActions;
  const { data, isLoading } = useGetAllActionsQuery();

  const isInstalled = (slug: string) => {
    return !!actions.find((action: ActionType) => action.slug === slug);
  };

  return (
    <div>
      <h2 className="text-lg mb-4"> New action</h2>

      <div className="flex">
        <Card
          className="cursor-pointer"
          onClick={() => {
            window.open('https://docs.tegon.ai/actions/overview', '_blank');
          }}
        >
          <CardHeader>
            <AddLine size={24} />
            <CardTitle>Create action</CardTitle>
            <CardDescription>Create from scratch</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-md mb-4"> Installed actions</h2>

        <div className="grid grid-cols-4 gap-4">
          {actions.map((action: ActionConfig) => (
            <ActionCard key={action.slug} action={action} />
          ))}
        </div>
      </div>

      {!isLoading && (
        <div className="mt-6">
          <h2 className="text-md mb-4"> All actions</h2>

          <div className="grid grid-cols-4 gap-4">
            {data
              .filter(
                (action: ActionExternalConfig) => !isInstalled(action.slug),
              )
              .map((action: ActionExternalConfig) => (
                <ActionCardExternal key={action.slug} action={action} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
});

export const ActionsWrapper = () => {
  return <Actions />;
};

ActionsWrapper.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SettingsLayout>
      <div className="h-[100vh] flex flex-col w-full">
        <ContentBox>
          <Header title="Actions" />
          <ScrollArea className="flex grow h-full">
            <div className="w-full p-6">{page}</div>
          </ScrollArea>
        </ContentBox>
      </div>
    </SettingsLayout>
  );
};
