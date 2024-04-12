/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiGithubFill } from '@remixicon/react';
import { useRouter } from 'next/router';

import { useGithubAccounts } from 'modules/settings/integrations/github/github-utils';

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
  const { githubAccounts } = useGithubAccounts(IntegrationName.Github);
  const githubIsIntegrated = githubAccounts.length > 0;
  const {
    push,
    query: { workspaceSlug },
  } = useRouter();

  const onSelect = (type: LinkedIssueSubType, integrationName: string) => {
    if (githubIsIntegrated) {
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
    </DropdownMenuGroup>
  );
}
