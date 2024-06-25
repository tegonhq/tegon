/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { WorkflowCategoryEnum, type WorkflowType } from 'common/types/team';

import { Editor, type EditorT } from 'components/ui/editor';
import { ScrollArea } from 'components/ui/scroll-area';
import { Separator } from 'components/ui/separator';
import { useIssueData } from 'hooks/issues';
import { useTeamWithId } from 'hooks/teams';
import { useTeamWorkflows } from 'hooks/workflows';

import { useUpdateIssueMutation } from 'services/issues/update-issue';

import { Activity } from './activity';
import { FileUpload } from './file-upload/file-upload';
import { FilterSmall } from './filters-small';
import { IssueTitle } from './issue-title';
import { LinkedIssuesView } from './linked-issues-view';
import { ParentIssueView } from './parent-issue-view';
import { SimilarIssuesView } from './similar-issues-view';
import { SubIssueView } from './sub-issue-view';

export const LeftSide = observer(() => {
  const [editor, setEditor] = React.useState<EditorT>(undefined);
  const issue = useIssueData();
  const team = useTeamWithId(issue.teamId);
  const workflows = useTeamWorkflows(team.identifier);
  const triageWorkflow = workflows.find(
    (workflow: WorkflowType) =>
      workflow.category === WorkflowCategoryEnum.TRIAGE,
  );
  const isTriageView = issue.stateId === triageWorkflow.id;

  const { mutate: updateIssue } = useUpdateIssueMutation({});

  const onDescriptionChange = useDebouncedCallback((content: string) => {
    updateIssue({
      description: content,
      teamId: issue.teamId,
      id: issue.id,
    });
  }, 1000);

  const onIssueChange = useDebouncedCallback((content: string) => {
    updateIssue({
      title: content,
      teamId: issue.teamId,
      id: issue.id,
    });
  }, 1000);

  return (
    <ScrollArea className="grow flex flex-col gap-2 h-full">
      <div className="flex xl:hidden px-6 py-2 border-b">
        <FilterSmall />
      </div>
      <div className="py-6 flex flex-col">
        {isTriageView && <SimilarIssuesView issueId={issue.id} />}

        <IssueTitle value={issue.title} onChange={onIssueChange} />
        {issue.parentId && (
          <div className="px-6">
            <ParentIssueView issue={issue} />
          </div>
        )}
        <Editor
          value={issue.description}
          onCreate={(editor) => setEditor(editor)}
          onChange={onDescriptionChange}
          className="min-h-[50px] mb-8 px-6 mt-3"
        />

        <div className="flex justify-end w-full py-1 px-4">
          <FileUpload editor={editor} />
        </div>

        <div className="mx-6">
          <Separator />
        </div>

        <SubIssueView childIssues={issue.children} issueId={issue.id} />

        <div className="mx-6">
          <Separator />
        </div>

        <LinkedIssuesView issueId={issue.id} />

        <div className="mx-6">
          <Separator />
        </div>
        <Activity />
      </div>
    </ScrollArea>
  );
});
