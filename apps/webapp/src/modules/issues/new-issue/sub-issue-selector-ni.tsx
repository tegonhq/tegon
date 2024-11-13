import { WorkflowCategoryEnum } from '@tegonhq/types';

import { SubIssueSelector, type IssueContent } from 'common/editor';
import type { WorkflowType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

interface SubIssueSelectorNIProps {
  subIssueOperations: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    append: any;
  };
  teamId: string;
}

export const SubIssueSelectorNI = ({
  subIssueOperations,
  teamId,
}: SubIssueSelectorNIProps) => {
  const { workflowsStore } = useContextStore();
  const workflows = workflowsStore.getWorkflowsForTeam(teamId);
  const backlog = workflows.find(
    (workflow: WorkflowType) =>
      workflow.category === WorkflowCategoryEnum.BACKLOG,
  );

  const onCreateIssues = (issueContents: IssueContent[]) => {
    issueContents.forEach((issueContent) => {
      subIssueOperations.append({
        teamId,
        stateId: backlog.id,
        description: issueContent.text,
        title: issueContent.text,
      });
    });
  };

  return <SubIssueSelector subIssue onCreate={onCreateIssues} />;
};
