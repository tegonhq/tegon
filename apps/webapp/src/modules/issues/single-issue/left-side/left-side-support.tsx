import { WorkflowCategoryEnum } from '@tegonhq/types';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { type WorkflowType } from 'common/types';

import { useIssueData } from 'hooks/issues';
import { useTeamWithId } from 'hooks/teams';
import { useTeamWorkflows } from 'hooks/workflows';

import { useUpdateIssueMutation } from 'services/issues';

import { CommentsActivity } from './activity/comments-activity';
import { IssueTitle } from './issue-title';
import { ParentIssueView } from './parent-issue-view';
import { SimilarIssuesView } from './similar-issues-view';

export const LeftSideSupport = observer(() => {
  const issue = useIssueData();
  const team = useTeamWithId(issue.teamId);

  const workflows = useTeamWorkflows(team.identifier);
  const triageWorkflow = workflows.find(
    (workflow: WorkflowType) =>
      workflow.category === WorkflowCategoryEnum.TRIAGE,
  );
  const isTriageView = issue.stateId === triageWorkflow?.id;

  const { mutate: updateIssue } = useUpdateIssueMutation({});

  const onIssueChange = useDebouncedCallback((content: string) => {
    updateIssue({
      title: content,
      teamId: issue.teamId,
      id: issue.id,
    });
  }, 1000);

  return (
    <ScrollArea className="grow flex h-full justify-center w-full">
      <div className="flex h-full justify-center w-full">
        <div className="grow flex flex-col gap-2 h-full max-w-[97ch]">
          <div className="py-6 flex flex-col">
            {isTriageView && <SimilarIssuesView issueId={issue.id} />}

            <IssueTitle value={issue.title} onChange={onIssueChange} />
            {issue.parentId && (
              <div className="px-6">
                <ParentIssueView issue={issue} />
              </div>
            )}

            <div className="px-6 flex flex-col">
              <CommentsActivity commentOrder={-1} />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
});
