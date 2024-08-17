import { Button } from '@tegonhq/ui/components/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@tegonhq/ui/components/collapsible';
import { ChevronDown, ChevronRight, DuplicateLine2 } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import { useRouter } from 'next/router';
import React from 'react';

import { ModalIssueItem } from 'modules/issues/components/modals/modal-issue-item';

import type { IssueType } from 'common/types';

import { useCurrentWorkspace } from 'hooks/workspace';

import { useGetSimilarIssuesQuery } from 'services/search';

interface SimilarIssuesViewProps {
  issueId: string;
}

interface SearchIssueType extends IssueType {
  issueNumber: string;
}

export function SimilarIssuesView({ issueId }: SimilarIssuesViewProps) {
  const workspace = useCurrentWorkspace();
  const [isOpen, setIsOpen] = React.useState(true);
  const { push } = useRouter();

  const { data: issues = [] } = useGetSimilarIssuesQuery(
    {
      workspaceId: workspace.id,
      issueId,
      limit: 3,
    },
    true,
  );

  return (
    <div
      className={cn('rounded-md p-2 mb-2 mx-6 bg-grayAlpha-100')}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex flex-col">
          <CollapsibleTrigger asChild>
            <div className="flex justify-start w-full">
              <Button
                variant="ghost"
                size="sm"
                className="px-2 pr-2 !bg-transparent"
              >
                <DuplicateLine2 size={16} className="mr-2" />
                Similar Issues
                {isOpen ? (
                  <ChevronDown size={16} className="mr-2" />
                ) : (
                  <ChevronRight size={16} className="mr-2" />
                )}
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 my-2">
            {issues.map((issue: SearchIssueType) => (
              <div
                key={issue.id}
                className="p-2 py-1"
                onClick={() => {
                  push(
                    `/${workspace.slug}/issue/${issue.issueNumber.toUpperCase()}`,
                  );
                }}
              >
                <ModalIssueItem issue={issue} />
              </div>
            ))}
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}
