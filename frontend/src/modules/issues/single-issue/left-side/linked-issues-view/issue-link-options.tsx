/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiGithubFill, RiLink, RiSlackFill } from '@remixicon/react';
import { useRouter } from 'next/router';

import { useIntegrationAccounts } from 'modules/settings/integrations/integration-util';

import { IntegrationName } from 'common/types/integration-definition';
import { LinkedIssueSubType } from 'common/types/linked-issue';

import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from 'components/ui/dropdown-menu';

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

  const {
    push,
    query: { workspaceSlug },
  } = useRouter();

  const onSelect = (type: LinkedIssueSubType, integrationName?: string) => {
    const githubIsIntegrated = githubAccounts.length > 0;
    const slackIsIntegrated = slackAccounts.length > 0;

    if (
      !integrationName ||
      (integrationName === 'github' && githubIsIntegrated) ||
      (integrationName === 'slack' && slackIsIntegrated)
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
          <RiGithubFill size={16} /> Link Github issue
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => onSelect(LinkedIssueSubType.GithubPullRequest, 'github')}
      >
        <div className="flex items-center gap-2">
          <RiGithubFill size={16} /> Link Github pull request
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => onSelect(LinkedIssueSubType.Slack, 'slack')}
      >
        <div className="flex items-center gap-2">
          <RiSlackFill size={16} /> Link Slack message
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => onSelect(LinkedIssueSubType.ExternalLink)}
      >
        <div className="flex items-center gap-2">
          <RiLink size={16} /> Link external
        </div>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}
