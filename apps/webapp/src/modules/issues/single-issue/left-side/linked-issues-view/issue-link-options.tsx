import { RiGithubFill, RiLink, RiSlackFill } from '@remixicon/react';
import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@tegonhq/ui/components/dropdown-menu';
import { SentryIcon } from '@tegonhq/ui/icons/index';
import { useRouter } from 'next/router';

import { useIntegrationAccounts } from 'modules/settings/workspace-settings/integrations/integration-util';

import { IntegrationName } from 'common/types/integration-definition';
import { LinkedIssueSubType } from 'common/types/linked-issue';

interface IssueLinkOptionsProps {
  setDialogOpen: (type: LinkedIssueSubType) => void;
}

export function IssueLinkOptions({ setDialogOpen }: IssueLinkOptionsProps) {
  const { integrationAccountsForName: githubAccounts } = useIntegrationAccounts(
    IntegrationName.Github,
  );
  const { integrationAccountsForName: slackAccounts } = useIntegrationAccounts(
    IntegrationName.Slack,
  );
  const { integrationAccountsForName: sentryAccounts } = useIntegrationAccounts(
    IntegrationName.Sentry,
  );

  const {
    push,
    query: { workspaceSlug },
  } = useRouter();

  const onSelect = (type: LinkedIssueSubType, integrationName?: string) => {
    const githubIsIntegrated = githubAccounts.length > 0;
    const slackIsIntegrated = slackAccounts.length > 0;
    const sentryIsIntegrated = sentryAccounts.length > 0;

    if (
      !integrationName ||
      (integrationName === 'github' && githubIsIntegrated) ||
      (integrationName === 'slack' && slackIsIntegrated) ||
      (integrationName === 'sentry' && sentryIsIntegrated)
    ) {
      setDialogOpen(type);
    } else {
      push(`/${workspaceSlug}/settings/integrations/${integrationName}`);
    }
  };

  return (
    <DropdownMenuGroup>
      <DropdownMenuItem
        onClick={() => onSelect(LinkedIssueSubType.GithubIssue, 'github')}
      >
        <div className="flex items-center gap-2">
          <RiGithubFill size={18} /> Link Github issue
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => onSelect(LinkedIssueSubType.GithubPullRequest, 'github')}
      >
        <div className="flex items-center gap-2">
          <RiGithubFill size={18} /> Link Github pull request
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => onSelect(LinkedIssueSubType.Slack, 'slack')}
      >
        <div className="flex items-center gap-2">
          <RiSlackFill size={18} /> Link Slack message
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => onSelect(LinkedIssueSubType.Sentry, 'sentry')}
      >
        <div className="flex items-center gap-2">
          <SentryIcon size={18} /> Link Sentry issue
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => onSelect(LinkedIssueSubType.ExternalLink)}
      >
        <div className="flex items-center gap-2">
          <RiLink size={18} /> Link external
        </div>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}
