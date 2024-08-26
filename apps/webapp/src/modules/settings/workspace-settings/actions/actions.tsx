import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@tegonhq/ui/components/card';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { AddLine } from '@tegonhq/ui/icons';

import { Header } from 'modules/settings/header';

import { SettingsLayout } from 'common/layouts/settings-layout';

import { useGetAllActionsQuery, type ActionSource } from 'services/action';

import { ActionCard } from './action-card';

export function Actions() {
  const { data: allActions, isLoading } = useGetAllActionsQuery();

  if (isLoading) {
    return null;
  }

  return (
    <div>
      <h2 className="text-lg mb-4"> New action</h2>

      <div className="flex">
        <Card className="cursor-pointer">
          <CardHeader>
            <AddLine size={24} />
            <CardTitle>Create action</CardTitle>
            <CardDescription>Create from scratch</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-4">
        <h2 className="text-md mb-4"> All actions</h2>

        <div className="grid grid-cols-4 gap-4">
          {allActions.map((action: ActionSource) => (
            <ActionCard key={action.slug} action={action} />
          ))}
        </div>
      </div>
    </div>
  );
}

Actions.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SettingsLayout>
      <div className="h-[100vh] flex flex-col w-full">
        <Header title="Actions" />
        <ScrollArea className="flex grow bg-background-2 rounded-tl-3xl">
          <div className="w-full p-6">{page} </div>
        </ScrollArea>
      </div>
    </SettingsLayout>
  );
};
