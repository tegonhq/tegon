import { Loader } from '@tegonhq/ui/components/loader';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { useParams } from 'next/navigation';

import { Header } from 'modules/settings/header';
import { SettingSection } from 'modules/settings/setting-section';

import { ContentBox } from 'common/layouts/content-box';
import { SettingsLayout } from 'common/layouts/settings-layout';

import { useGetIntegrationDefinition } from 'services/integration-definition';

import { WorkspaceAuth } from './workspace-auth';

export function Integration() {
  const { integrationDefinitionId } = useParams();
  const { data: integrationDefinition, isLoading } =
    useGetIntegrationDefinition(integrationDefinitionId as string);

  return (
    <>
      {!isLoading && <Header title={integrationDefinition.name} />}
      <ContentBox>
        <ScrollArea className="flex grow h-full">
          <div className="w-full p-6">
            {!isLoading && (
              <SettingSection
                title={integrationDefinition.name}
                description={integrationDefinition.description}
              >
                <WorkspaceAuth integrationDefinition={integrationDefinition} />
              </SettingSection>
            )}

            {isLoading && (
              <Loader text="Fetching specification (Currently optimizing for faster performance.)" />
            )}
          </div>
        </ScrollArea>
      </ContentBox>
    </>
  );
}

Integration.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SettingsLayout>
      <div className="h-[100vh] flex flex-col w-full">{page}</div>
    </SettingsLayout>
  );
};
