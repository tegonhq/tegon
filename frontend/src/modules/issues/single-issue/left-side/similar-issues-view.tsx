/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiArrowDownSFill, RiArrowRightSFill } from '@remixicon/react';
import React from 'react';

import { ModalIssueItem } from 'modules/issues/components/modals/modal-issue-item';

import type { IssueType } from 'common/types/issue';

import { Button } from 'components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'components/ui/collapsible';
import { useCurrentWorkspace } from 'hooks/workspace';
import { DuplicateLine2 } from 'icons';

import { useGetSearchIssuesQuery } from 'services/search';

interface SimilarIssuesViewProps {
  title: string;
}

export function SimilarIssuesView({ title }: SimilarIssuesViewProps) {
  const workspace = useCurrentWorkspace();
  const [isOpen, setIsOpen] = React.useState(true);

  const { data: issues } = useGetSearchIssuesQuery(
    {
      workspaceId: workspace.id,
      query: title,
      limit: 3,
    },
    true,
  );

  if (!issues || (issues && issues.length === 0)) {
    return null;
  }

  return (
    <div className="rounded-md border p-2 mb-2 ">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex flex-col">
          <CollapsibleTrigger asChild>
            <div className="flex justify-start w-full">
              <Button
                variant="ghost"
                size="xs"
                className="text-muted-foreground px-2 pr-2 !bg-transparent"
              >
                {isOpen ? (
                  <RiArrowDownSFill size={16} className="mr-2" />
                ) : (
                  <RiArrowRightSFill size={16} className="mr-2" />
                )}
                <DuplicateLine2 size={16} className="mr-2" />
                Similar Issues
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 my-2">
            {issues.map((issue: IssueType) => (
              <div key={issue.id} className="p-2 py-1">
                <ModalIssueItem issue={issue} />
              </div>
            ))}
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}
