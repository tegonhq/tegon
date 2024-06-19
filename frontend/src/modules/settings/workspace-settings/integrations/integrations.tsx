/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiGithubFill } from '@remixicon/react';
import { useRouter } from 'next/router';

import { Header } from 'modules/settings/header';
import { SettingSection } from 'modules/settings/setting-section';

import { SettingsLayout } from 'common/layouts/settings-layout';

import { Button } from 'components/ui/button';
import { ScrollArea } from 'components/ui/scroll-area';
import { useCurrentWorkspace } from 'hooks/workspace';
import { SentryIcon, SlackIcon } from 'icons';

interface IntegrationCardProps {
  name: string;
  description: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: any;
}

function IntegrationCard({
  name,
  description,
  href,
  Icon,
}: IntegrationCardProps) {
  const { push } = useRouter();
  const currentWorkspace = useCurrentWorkspace();

  return (
    <div
      className="p-3 rounded-md cursor-pointer bg-gray-50"
      onClick={() =>
        push(`/${currentWorkspace.slug}/settings/integrations/${href}`)
      }
    >
      <div className="flex items-center gap-2">
        <div className="border p-1 rounded-md">
          <Icon size={24} />
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
  return (
    <SettingSection
      title="Integrations"
      description="Manage your workspace integrations"
    >
      <div className="flex flex-col gap-2">
        <IntegrationCard
          name="Github"
          description="Automate your pull request and commit workflows and keep issues synced both ways"
          href="github"
          Icon={RiGithubFill}
        />
        <IntegrationCard
          name="Slack"
          description="Create issues from Slack messages and sync threads"
          href="slack"
          Icon={SlackIcon}
        />
        <IntegrationCard
          name="Sentry"
          description="Connect sentry issues with the tegon issues"
          href="sentry"
          Icon={SentryIcon}
        />
      </div>
    </SettingSection>
  );
}

Integrations.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SettingsLayout>
      <div className="h-[100vh] flex flex-col w-full">
        <Header title="Overview" />
        <ScrollArea className="flex grow bg-gray-200 rounded-tl-2xl">
          <div className="w-full p-6">{page} </div>
        </ScrollArea>
      </div>
    </SettingsLayout>
  );
};
