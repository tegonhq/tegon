import { Button } from '@tegonhq/ui/components/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@tegonhq/ui/components/collapsible';
import { AddLine, ChevronDown, ChevronRight } from '@tegonhq/ui/icons';
import * as React from 'react';

import { IssueListItem } from 'modules/issues/components';
import { useSortIssues } from 'modules/issues/components/issue-list-item/utils';
import { NewIssueDialog } from 'modules/issues/new-issue/new-issue-dialog';

import type { IssueType } from 'common/types';

interface SubIssueViewProps {
  childIssues: IssueType[];
  issueId: string;
}

export function SubIssueView({ childIssues, issueId }: SubIssueViewProps) {
  const [newIssueDialog, setNewIssueDialog] = React.useState(false);
  const [isOpen, setOpen] = React.useState(
    childIssues.length === 0 ? false : true,
  );
  const issues = useSortIssues(childIssues);

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setOpen} className="w-full py-3">
        <div className="flex justify-between px-6">
          <div>
            <CollapsibleTrigger asChild>
              <div className="flex items-center">
                <Button variant="link" className="px-0 text-md">
                  Sub-issues
                  {isOpen ? (
                    <ChevronDown size={16} className="ml-1" />
                  ) : (
                    <ChevronRight size={16} className="ml-1" />
                  )}
                </Button>

                {!isOpen && (
                  <div className="px-2 ml-1 rounded-sm bg-grayAlpha-100 text-foreground">
                    {issues.length}
                  </div>
                )}
              </div>
            </CollapsibleTrigger>
          </div>

          <div>
            <Button
              variant="link"
              className="pr-0"
              onClick={() => setNewIssueDialog(true)}
              disabled={newIssueDialog}
            >
              <AddLine size={16} />
            </Button>
          </div>
        </div>
        <CollapsibleContent>
          <div className="pt-1 px-3">
            {issues.map((issue: IssueType, index: number) => (
              <IssueListItem
                issueId={issue.id}
                subIssueView
                key={issue.id}
                noBorder={index === issues.length - 1}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      <NewIssueDialog
        open={newIssueDialog}
        setOpen={setNewIssueDialog}
        defaultValues={{ parentId: issueId }}
      />
    </>
  );
}
