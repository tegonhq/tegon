import { Button } from '@tegonhq/ui/components/button';
import { Loader } from '@tegonhq/ui/components/loader';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { useRouter } from 'next/router';

import { Header } from 'modules/settings/header';
import { SettingSection } from 'modules/settings/setting-section';

import { getIcon, toProperCase, type IconType } from 'common';
import { SettingsLayout } from 'common/layouts/settings-layout';

import { useCurrentWorkspace } from 'hooks/workspace';

import { useGetIntegrationDefinitions } from 'services/integration-definition';

interface IntegrationCardProps {
  name: string;
  description: string;
  href: string;

  icon: string;
}

function IntegrationCard({
  name,
  description,
  href,
  icon,
}: IntegrationCardProps) {
  const { push } = useRouter();
  const currentWorkspace = useCurrentWorkspace();
  const Icon = getIcon(icon as IconType);

  return (
    <div
      className="p-3 rounded-md cursor-pointer bg-background-3"
      onClick={() =>
        push(`/${currentWorkspace.slug}/settings/integrations/${href}`)
      }
    >
      <div className="flex items-center gap-2">
        <div className="border p-1 rounded-md dark:bg-foreground">
          <Icon size={24} className="dark:text-background" />
        </div>
        <div className="grow">
          <div className="font-medium"> {name} </div>
          <div className="text-muted-foreground">{description}</div>
        </div>
        <div>
          <Button variant="secondary"> View </Button>
        </div>
      </div>
    </div>
  );
}

export function Integrations() {
  const currentWorkspace = useCurrentWorkspace();
  const { data: integrations, isLoading } = useGetIntegrationDefinitions(
    currentWorkspace.id,
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SettingSection
      title="Integrations"
      description="Manage your workspace integrations"
    >
      <div className="flex flex-col gap-2">
        {integrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            name={toProperCase(integration.name)}
            description={integration.description}
            href={integration.id}
            icon={integration.icon}
          />
        ))}
      </div>
    </SettingSection>
  );
}

Integrations.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SettingsLayout>
      <div className="h-[100vh] flex flex-col w-full">
        <Header title="Integrations" />
        <ScrollArea className="flex grow bg-background-2 rounded-tl-3xl">
          <div className="w-full p-6">{page} </div>
        </ScrollArea>
      </div>
    </SettingsLayout>
  );
};
