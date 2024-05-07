/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiGithubFill, type RemixiconComponentType } from '@remixicon/react';
import { useRouter } from 'next/router';

import { SettingsLayout } from 'common/layouts/settings-layout';

import { Separator } from 'components/ui/separator';
import { useCurrentWorkspace } from 'hooks/workspace';
import { SentryIcon, SlackIcon } from 'icons';

interface IntegrationCardProps {
  name: string;
  description: string;
  href: string;
  Icon: RemixiconComponentType;
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
      className="p-3 border rounded-md text-sm cursor-pointer hover:bg-active/50"
      onClick={() =>
        push(`/${currentWorkspace.slug}/settings/integrations/${href}`)
      }
    >
      <div className="flex items-center gap-2">
        <div className="border p-1 rounded-md bg-background">
          <Icon size={18} />
        </div>
        <div>
          <div className="font-medium"> {name} </div>
        </div>
      </div>

      <div className="text-xs mt-2 text-muted-foreground">{description}</div>
    </div>
  );
}

export function Integrations() {
  return (
    <div className="flex flex-col w-full">
      <div className="hidden md:flex flex-shrink-0 h-[65px]"></div>
      <div className="flex items-start justify-center">
        <div className="max-w-[100%] md:max-w-[650px] w-full">
          <div className="flex flex-col">
            <h2 className="text-2xl"> Integrations </h2>
            <p className="text-sm text-muted-foreground">
              Manage your workspace integrations
            </p>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-3 gap-4">
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
        </div>
      </div>
    </div>
  );
}

Integrations.getLayout = function getLayout(page: React.ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};
