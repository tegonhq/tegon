import { Button } from '@tegonhq/ui/components/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@tegonhq/ui/components/collapsible';
import {
  BlockedFill,
  BlocksFill,
  ChevronDown,
  ChevronRight,
  IssuesLine,
  RelatedIssueLine,
} from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { IssueListItem } from 'modules/issues/components';
import { useSortIssues } from 'modules/issues/components/issue-list-item/utils';

import type { IssueRelationType, IssueType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

interface RelationsViewProps {
  issueId: string;
}

const IssuesView = ({ issues }: { issues: IssueType[] }) => {
  const sortedIssues = useSortIssues(issues);

  return (
    <>
      {sortedIssues.map((issue: IssueType) => (
        <IssueListItem
          issueId={issue.id}
          subIssueView
          key={issue.id}
          noBorder={false}
        />
      ))}
    </>
  );
};

export const RelationsView = observer(({ issueId }: RelationsViewProps) => {
  const { issueRelationsStore, issuesStore } = useContextStore();

  const [isOpen, setOpen] = React.useState(false);
  const issuesMap = issueRelationsStore.getIssueRelationForIssue(issueId);

  const relationSections = [
    {
      type: 'BLOCKED',
      label: 'Blocked by',
      icon: <BlockedFill className="h-4 w-4 text-red-500" />,
    },
    {
      type: 'BLOCKS',
      label: 'Blocks',
      icon: <BlocksFill className="h-4 w-4 text-red-500" />,
    },
    {
      type: 'DUPLICATE',
      label: 'Duplicates',
      icon: <RelatedIssueLine className="h-4 w-4" />,
    },
    {
      type: 'RELATED',
      label: 'Related to',
      icon: <IssuesLine className="h-4 w-4" />,
    },
  ];

  const totalIssues = Object.values(issuesMap).reduce(
    (acc: number, curr: string[]) => acc + curr.length,
    0,
  ) as number;

  const getIssues = (issueRelationIds: string[]) => {
    const relations = issueRelationsStore.getRelationFromIds(issueRelationIds);

    return issuesStore.getIssuesFromArray(
      relations.map((relation: IssueRelationType) => relation.relatedIssueId),
    );
  };

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setOpen} className="w-full py-2">
        <div className="flex justify-between px-6">
          <div>
            <CollapsibleTrigger asChild>
              <div className="flex items-center">
                <Button variant="link" className="px-0 text-md">
                  Relations
                  {isOpen ? (
                    <ChevronDown size={16} className="ml-1" />
                  ) : (
                    <ChevronRight size={16} className="ml-1" />
                  )}
                </Button>

                {!isOpen && (
                  <div className="px-2 ml-1 rounded-sm bg-grayAlpha-100 text-foreground">
                    {totalIssues}
                  </div>
                )}
              </div>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          <div className="pt-1 px-3 flex flex-col gap-2">
            {relationSections.map(
              ({ type, label, icon }) =>
                issuesMap[type]?.length > 0 && (
                  <div key={type}>
                    <div className="flex mx-3 p-1 px-2 bg-grayAlpha-100 w-fit gap-1 items-center rounded">
                      {icon}
                      <div>{label}</div>
                      <div className="text-muted-foreground">
                        {issuesMap[type].length}
                      </div>
                    </div>
                    <div className="mt-2">
                      <IssuesView issues={getIssues(issuesMap[type])} />
                    </div>
                  </div>
                ),
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
});
