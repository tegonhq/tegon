import { WorkflowCategoryEnum } from '@tegonhq/types';
import { useEditor } from '@tegonhq/ui/components/editor/index';
import { useRouter } from 'next/router';

import { SubIssueSelector, type IssueContent } from 'common/editor';
import type { IssueType, WorkflowType } from 'common/types';

import { useProject } from 'hooks/projects';
import { useTeamWithId } from 'hooks/teams';

import { useCreateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

export const ProjectSubIssueSelector = () => {
  const project = useProject();
  const { query } = useRouter();
  const { editor } = useEditor();

  const team = useTeamWithId(project.teams[0]);
  const { workflowsStore } = useContextStore();
  const workflows = workflowsStore.getWorkflowsForTeam(team.id);
  const backlog = workflows.find(
    (workflow: WorkflowType) =>
      workflow.category === WorkflowCategoryEnum.BACKLOG,
  );
  const { mutate: createIssue } = useCreateIssueMutation({});

  const onCreateIssues = (issueContents: IssueContent[]) => {
    issueContents.forEach((issueContent) => {
      createIssue(
        {
          description: issueContent.text,
          teamId: team.id,
          stateId: backlog.id,
          projectId: project?.id,
        },
        {
          onSuccess: (issue: IssueType) => {
            const url = `http://app.tegon.ai/${query.workspaceSlug}/issue/${team.identifier}-${issue.number}`;

            editor
              .chain()
              .focus()
              .insertContentAt(
                {
                  from: issueContent.start,
                  to: issueContent.end,
                },
                {
                  type: 'tegonIssueExtension',
                  attrs: {
                    url,
                  },
                },
              )
              .run();
          },
        },
      );
    });
  };

  return <SubIssueSelector text="Create issue" onCreate={onCreateIssues} />;
};
