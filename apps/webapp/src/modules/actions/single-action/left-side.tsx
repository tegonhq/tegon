import { buttonVariants } from '@tegonhq/ui/components/button';
import { Editor, EditorExtensions } from '@tegonhq/ui/components/editor/editor';
import { suggestionItems } from '@tegonhq/ui/components/editor/slash-command';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@tegonhq/ui/components/tabs';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';

import { convertToTitleCase } from 'common';

import { useGetExternalActionDataQuery } from 'services/action';

import { useContextStore } from 'store/global-context-provider';

import { Configuration } from './tabs/configuration';

export const LeftSide = observer(() => {
  const { actionSlug } = useParams();
  const { actionsStore } = useContextStore();

  const action = actionsStore.getAction(actionSlug);
  const { isLoading: loading, data: latestAction } =
    useGetExternalActionDataQuery(actionSlug as string);

  const actionConfig = action.config;

  if (loading) {
    return null;
  }

  return (
    <ScrollArea className="grow flex flex-col p-6 h-full gap-2">
      <h2 className="text-xl">{convertToTitleCase(action.name)}</h2>
      <p className="text-md text-muted-foreground">
        {latestAction?.description}
      </p>

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

          {/* <TabsTrigger
            value="runs"
            className={cn(
              buttonVariants({
                variant: 'secondary',
              }),
            )}
          >
            Runs
          </TabsTrigger> */}
        </TabsList>
        <TabsContent value="overview">
          <div className="flex gap-2">
            <div>
              <Editor
                className="new-issue-editor min-h-[200px] text-base"
                value={latestAction.guide}
                editable={false}
                editorClassName="min-h-[300px]"
                extensions={[]}
              >
                <EditorExtensions suggestionItems={suggestionItems} />
              </Editor>
            </div>

            {actionConfig && <div></div>}
          </div>
        </TabsContent>
        {actionConfig && (
          <TabsContent value="configuration">
            <Configuration schema={actionConfig.inputs} />
          </TabsContent>
        )}
        {/* <TabsContent value="runs">
          <Runs slug={actionSlug as string} />
        </TabsContent> */}
      </Tabs>
    </ScrollArea>
  );
});
