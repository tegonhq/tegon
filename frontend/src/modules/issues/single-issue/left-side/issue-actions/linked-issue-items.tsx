/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiExternalLinkLine, RiGithubFill } from '@remixicon/react';
import * as React from 'react';

import type { IssueType } from 'common/types/issue';
import { LinkedIssueSubType } from 'common/types/linked-issue';

import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuItem,
} from 'components/ui/dropdown-menu';

import { DropdownItem } from './dropdown-item';
import { AddLinkedIssueDialog } from '../linked-issues-view/add-linked-issue-dialog';

interface LinkedIssueItemsProps {
  issue: IssueType;
}

export function LinkedIssueItems({ issue }: LinkedIssueItemsProps) {
  const [dialogOpen, setDialogOpen] =
    React.useState<LinkedIssueSubType>(undefined);

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
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>

      <AddLinkedIssueDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        issueId={issue.id}
      />
    </>
  );
}
