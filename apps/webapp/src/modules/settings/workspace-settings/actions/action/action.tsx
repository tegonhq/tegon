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
import { useParams } from 'next/navigation';

import { Header } from 'modules/settings/header';
import { SettingSection } from 'modules/settings/setting-section';

import { SettingsLayout } from 'common/layouts/settings-layout';
import { ActionAccessGuard } from 'common/wrappers/action-access-guard';

import { useGetExternalActionDataQuery } from 'services/action';

import { useContextStore } from 'store/global-context-provider';

import { Metadata } from './components/metadata';
import { Configuration } from './configuration';

export const Action = () => {
  const { actionSlug } = useParams<{ actionSlug: string }>();
  const { actionsStore } = useContextStore();
  const action = actionsStore.getAction(actionSlug);

  const { data: latestAction, isLoading } =
    useGetExternalActionDataQuery(actionSlug);

  const metadata = (
    <div className="mt-3 flex gap-2">
      <Metadata />
    </div>
  );

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Header title="Actions" />
      <ScrollArea className="flex grow bg-background-2 rounded-tl-3xl">
        <div className="w-full p-6">
          <SettingSection
            title={action.name}
            description={action.description}
            metadata={metadata}
          >
            <Tabs defaultValue="overview">
              <TabsList className="bg-transparent flex gap-2 justify-start px-0">
                <>
                  <TabsTrigger
                    value="overview"
                    className={cn(
                      buttonVariants({
                        variant: 'secondary',
                      }),
                    )}
                  >
                    Overview
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
              </TabsList>
              <TabsContent value="overview">
                <div className="flex gap-2">
                  <div>
                    <Editor
                      className="new-issue-editor min-h-[200px] text-base"
                      value={latestAction?.guide}
                      editable={false}
                      editorClassName="min-h-[300px]"
                      extensions={[]}
                    >
                      <EditorExtensions suggestionItems={suggestionItems} />
                    </Editor>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="configuration">
                <Configuration />
              </TabsContent>
            </Tabs>
          </SettingSection>
        </div>
      </ScrollArea>
    </>
  );
};

Action.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SettingsLayout>
      <div className="h-[100vh] flex flex-col w-full">
        <ActionAccessGuard>{page}</ActionAccessGuard>
      </div>
    </SettingsLayout>
  );
};
