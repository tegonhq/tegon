/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IssueType } from 'common/types/issue';

import { SubIssueItem } from './sub-issue-item';

interface SubIssueViewProps {
  childIssues: IssueType[];
}

export function SubIssueView({ childIssues }: SubIssueViewProps) {
  return (
    <div>
      {childIssues.map((issue: IssueType) => (
        <SubIssueItem issue={issue} key={issue.id} />
      ))}
    </div>
  );
}
