import { ActionStatusEnum } from '@tegonhq/types';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { Badge } from '@tegonhq/ui/components/badge';
import { convertToTitleCase } from 'common';
import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
import { useContextStore } from 'store/global-context-provider';
import { useUserData } from 'hooks/users';
import { AvatarText } from '@tegonhq/ui/components/avatar';
import { useGetExternalActionDataQuery } from 'services/action';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@tegonhq/ui/components/tabs';
import { cn } from '@tegonhq/ui/lib/utils';
import { buttonVariants } from '@tegonhq/ui/components/button';
import { Editor, EditorExtensions } from '@tegonhq/ui/components/editor/editor';
import { suggestionItems } from '@tegonhq/ui/components/ui/editor/slash-command';
import { Loader } from '@tegonhq/ui/components/ui/loader';
import { Runs } from './runs';

const StatusMapping = {
  [ActionStatusEnum.ACTIVE]: 'Active',
  [ActionStatusEnum.INSTALLED]: 'Installed',
  [ActionStatusEnum.NEEDS_CONFIGURATION]: 'Needs configuration',
  [ActionStatusEnum.SUSPENDED]: 'Suspended',
  [ActionStatusEnum.DEPLOYING]: 'Deploying',
  [ActionStatusEnum.ERRORED]: 'Errored',
};

type StatusMapKey = keyof typeof StatusMapping;

export const SingleAction = observer(() => {
  const { actionSlug } = useParams();
  const { actionsStore } = useContextStore();

  const action = actionsStore.getAction(actionSlug);
  const { userData, isLoading } = useUserData(action?.createdById);
  const { isLoading: loading, data: latestAction } =
    useGetExternalActionDataQuery(actionSlug as string);

  const actionConfig = action.config ?? JSON.parse(action.config);

  if (isLoading || loading) {
    return null;
  }

  return (
    <ScrollArea className="grow flex flex-col p-6 h-full gap-2">
      <h2 className="text-xl">{convertToTitleCase(action.name)}</h2>
      <p className="text-md text-muted-foreground">
        {latestAction?.description}
      </p>

      <div className="flex mt-3 gap-6">
        <div className="min-w-[80px] flex flex-col gap-1">
          <div>State</div>
          <div className="font-semibold">
            {StatusMapping[action.status as StatusMapKey]}
          </div>
        </div>

        <div className="min-w-[80px] flex flex-col gap-1">
          <div>Version</div>
          <div className="font-semibold">v{action.version}</div>
        </div>

        <div className="min-w-[80px] flex flex-col gap-1">
          <div>Integrations</div>
          <div className="flex gap-1">
            {action.integrations.map((integration: string) => (
              <Badge
                variant="secondary"
                key={integration}
                className="flex items-center gap-1"
              >
                {integration}
              </Badge>
            ))}
          </div>
        </div>

        <div className="min-w-[80px] flex flex-col gap-1">
          <div>Created by</div>
          <div className="flex gap-1 items-center">
            <AvatarText text={userData.fullname} /> {userData.fullname}
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="mt-6">
        <TabsList className="bg-transparent flex gap-2 justify-start px-0">
          <TabsTrigger
            value="description"
            className={cn(
              buttonVariants({
                variant: 'secondary',
              }),
            )}
          >
            Description
          </TabsTrigger>

          {actionConfig.inputs && (
            <TabsTrigger
              value="configuration"
              className={cn(
                buttonVariants({
                  variant: 'secondary',
                }),
              )}
            >
              Configuration
            </TabsTrigger>
          )}

          <TabsTrigger
            value="runs"
            className={cn(
              buttonVariants({
                variant: 'secondary',
              }),
            )}
          >
            Runs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description">
          <Editor
            className="new-issue-editor min-h-[200px] text-base"
            value={latestAction.guide}
            editable={false}
            editorClassName="min-h-[300px]"
            extensions={[]}
          >
            <EditorExtensions suggestionItems={suggestionItems} />
          </Editor>
        </TabsContent>
        {actionConfig && (
          <TabsContent value="configuration">
            Make changes to your account here.
          </TabsContent>
        )}
        <TabsContent value="runs">
          <Runs slug={actionSlug as string} />
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
});

export function SingleActionWrapper() {
  const { actionSlug } = useParams();
  const { actionsStore } = useContextStore();

  const action = actionsStore.getAction(actionSlug);

  if (!action) {
    return <Loader text="No action found" />;
  }

  return <SingleAction />;
}
