/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiGithubFill, RiMoreFill } from '@remixicon/react';

import type { LinkedIssueType } from 'common/types/linked-issue';

import { Button } from 'components/ui/button';

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
      className="cursor-pointer w-full mb-1 border-1 hover:bg-gray-100 dark:hover:bg-gray-700/50 shadow-sm bg-background dark:bg-gray-700/20  p-2 py-3 rounded-md flex gap-2 items-center justify-between text-sm"
    >
      <div className="flex items-center gap-2">
        <RiGithubFill size={18} className="text-muted-foreground" />
        <div className="text-foreground">
          #{number} {sourceData.title}
        </div>
      </div>

      <div>
        <Button
          variant="ghost"
          size="xs"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <RiMoreFill size={14} className="text-muted-foreground" />
        </Button>
      </div>
    </a>
  );
}
