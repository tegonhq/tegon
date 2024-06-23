/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  RiExternalLinkLine,
  RiGithubFill,
  RiLink,
  RiSlackFill,
} from '@remixicon/react';
import * as React from 'react';

import { LinkedIssueSubType } from 'common/types/linked-issue';

import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuItem,
} from 'components/ui/dropdown-menu';

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
          <DropdownMenuSubContent className="text-muted-foreground">
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
