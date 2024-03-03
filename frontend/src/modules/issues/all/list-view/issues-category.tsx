/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { WORKFLOW_CATEGORY_ICONS } from 'modules/settings/team/workflow/workflow-item';

import { IssueType } from 'common/types/issue';
import { WorkflowType } from 'common/types/team';

import { IssueItem } from './issue-item';

interface IssuesCategoryProps {
  workflow: WorkflowType;
  issues: IssueType[];
}

export function IssuesCategory({ workflow, issues }: IssuesCategoryProps) {
  const CategoryIcon =
    WORKFLOW_CATEGORY_ICONS[workflow.name] ??
    WORKFLOW_CATEGORY_ICONS['Backlog'];

  if (issues.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center w-full pl-8 p-2 bg-slate-100 dark:bg-slate-900">
        <CategoryIcon
          size={18}
          className="text-muted-foreground"
          color={workflow.color}
        />
        <h3 className="pl-2 text-sm font-medium"> {workflow.name} </h3>
      </div>

      <div>
        {issues.map((issue) => (
          <IssueItem issue={issue} key={issue.id} />
        ))}
      </div>
    </div>
  );
}
