import { RiArrowDownSFill, RiArrowRightSFill } from '@remixicon/react';
import { useRouter } from 'next/router';
import React from 'react';

import { ModalIssueItem } from 'modules/issues/components/modals/modal-issue-item';

import { cn } from 'common/lib/utils';
import type { IssueType } from 'common/types/issue';

import { Button } from 'components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'components/ui/collapsible';
import { useCurrentWorkspace } from 'hooks/workspace';
import { DuplicateLine2 } from 'icons';

import { useGetDuplicateIssuesQuery } from 'services/search';

interface DuplicateIssuesViewProps {
  description: string;
}

interface SearchIssueType extends IssueType {
  issueNumber: string;
}

export function DuplicateIssuesView({ description }: DuplicateIssuesViewProps) {
  const workspace = useCurrentWorkspace();
  const [isOpen, setIsOpen] = React.useState(true);
  const { push } = useRouter();

  const { data: issues, refetch } = useGetDuplicateIssuesQuery(
    {
      workspaceId: workspace.id,
      query: description,
      limit: 3,
    },
    false,
  );

  React.useEffect(() => {
    if (description) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  if (!issues || (issues && issues.length === 0)) {
    return null;
  }

  return (
    <div
      className={cn('p-2 rounded-none border-0 border-t mb-0')}
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
                className="text-muted-foreground px-2 pr-2 !bg-transparent"
              >
                {isOpen ? (
                  <RiArrowDownSFill size={16} className="mr-2" />
                ) : (
                  <RiArrowRightSFill size={16} className="mr-2" />
                )}
                <DuplicateLine2 size={16} className="mr-2" />
                Possible duplicates
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
