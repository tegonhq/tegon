import {
  RiExternalLinkLine,
  RiGithubFill,
  RiLink,
  RiSlackFill,
} from '@remixicon/react';
import { LinkedIssueSubType } from 'common/types';
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuItem,
} from '@tegonhq/ui/components/dropdown-menu';
import * as React from 'react';

import { DropdownItem } from './dropdown-item';

interface LinkedIssueItemsProps {
  setDialogOpen: (type: LinkedIssueSubType) => void;
}

export function LinkedIssueItems({ setDialogOpen }: LinkedIssueItemsProps) {
  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <DropdownItem Icon={RiExternalLinkLine} title="Add link" />
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              onClick={() => setDialogOpen(LinkedIssueSubType.GithubIssue)}
            >
              <DropdownItem Icon={RiGithubFill} title="Github issue" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setDialogOpen(LinkedIssueSubType.GithubPullRequest)
              }
            >
              <DropdownItem Icon={RiGithubFill} title="Github pull request" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDialogOpen(LinkedIssueSubType.Slack)}
            >
              <DropdownItem Icon={RiSlackFill} title="Link Slack message" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDialogOpen(LinkedIssueSubType.ExternalLink)}
            >
              <DropdownItem Icon={RiLink} title="Link external" />
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </>
  );
}
