/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  RiDeleteBin7Fill,
  RiGithubFill,
  RiMoreFill,
  RiPencilFill,
} from '@remixicon/react';

import type { LinkedIssueType } from 'common/types/linked-issue';

import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';

interface LinkedIssueItemProps {
  linkedIssue: LinkedIssueType;
}

export function LinkedIssueItem({ linkedIssue }: LinkedIssueItemProps) {
  const sourceData = JSON.parse(linkedIssue.sourceData);
  const number =
    sourceData.apiUrl.split('/')[sourceData.apiUrl.split('/').length - 1];

  return (
    <a
      href={linkedIssue.url}
      target="_blank"
      className="cursor-pointer w-full mb-1 border-1 hover:bg-slate-50 dark:hover:bg-slate-700/50 shadow-sm bg-background dark:bg-slate-700/20  p-3 py-3 rounded-md flex gap-2 items-center justify-between text-sm"
    >
      <div className="flex items-center gap-2">
        <RiGithubFill size={18} className="text-muted-foreground" />
        <div className="text-foreground">
          #{number} {sourceData.title}
        </div>
      </div>

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="xs"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <RiMoreFill size={16} className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <RiPencilFill size={14} /> Edit
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <RiDeleteBin7Fill size={14} /> Remove
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </a>
  );
}
