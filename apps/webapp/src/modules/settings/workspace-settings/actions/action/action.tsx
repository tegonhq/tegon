import { buttonVariants } from '@tegonhq/ui/components/button';
import {
  Editor,
  EditorExtensions,
  suggestionItems,
} from '@tegonhq/ui/components/editor/index';
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

import { Header } from 'modules/settings/header';
import { SettingSection } from 'modules/settings/setting-section';

import { SettingsLayout } from 'common/layouts/settings-layout';

import { useGetExternalActionDataQuery } from 'services/action';

import { useContextStore } from 'store/global-context-provider';

import { Configuration } from './configuration';

export const Action = observer(() => {
  const { actionSlug } = useParams();
  const { actionsStore } = useContextStore();
  const action = actionsStore.getAction(actionSlug);
  const { data: latestAction } = useGetExternalActionDataQuery(action.slug);

  return (
    <>
      <Header title="Actions" />
      <ScrollArea className="flex grow bg-background-2 rounded-tl-3xl">
        <div className="w-full p-6">
          <SettingSection
            title={action.name}
            description={latestAction?.description}
          >
            <Tabs defaultValue="description">
              <TabsList className="bg-transparent flex gap-2 justify-start px-0">
                {action.config.inputs && (
                  <>
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
                  </>
                )}
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
                </div>
              </TabsContent>
              {action.config?.inputs && (
                <TabsContent value="configuration">
                  <Configuration schema={action.config?.inputs} />
                </TabsContent>
              )}
            </Tabs>
          </SettingSection>
        </div>
      </ScrollArea>
    </>
  );
});

export const ActionWrapper = () => {
  const { actionSlug } = useParams();
  const { actionsStore } = useContextStore();
  const action = actionsStore.getAction(actionSlug);

  if (!action) {
    return <h2> No action found </h2>;
  }

  return <Action />;
};

ActionWrapper.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SettingsLayout>
      <div className="h-[100vh] flex flex-col w-full">{page}</div>
    </SettingsLayout>
  );
};
