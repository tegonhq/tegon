import { WorkflowCategoryEnum } from '@tegonhq/types';
import { useEditor } from '@tegonhq/ui/components/editor/index';
import { useRouter } from 'next/router';

import { SubIssueSelector, type IssueContent } from 'common/editor';
import { delay } from 'common/lib/common';
import type { WorkflowType } from 'common/types';

import { useCycle } from 'hooks/cycles';
import { useTeamWithId } from 'hooks/teams';

import { useCreateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

export const CycleSubIssueSelector = () => {
  const cycle = useCycle();
  const { query } = useRouter();
  const { editor } = useEditor();

  const team = useTeamWithId(cycle.teamId);
  const { workflowsStore } = useContextStore();
  const workflows = workflowsStore.getWorkflowsForTeam(team.id);
  const backlog = workflows.find(
    (workflow: WorkflowType) =>
      workflow.category === WorkflowCategoryEnum.BACKLOG,
  );
  const { mutate: createIssue } = useCreateIssueMutation({
    onSuccess: (data, variables) => {
      const url = `http://app.tegon.ai/${query.workspaceSlug}/issue/${team.identifier}-${data.number}`;

      editor
        .chain()
        .focus()
        .insertContentAt(
          {
            from: variables.start,
            to: variables.end,
          },
          {
            type: 'tegonIssueExtension',
            attrs: {
              url,
            },
          },
        )
        .exitCode()
        .run();
    },
  });

  const onCreateIssues = async (issueContents: IssueContent[]) => {
    for (const issueContent of issueContents.reverse()) {
      createIssue({
        description: issueContent.text,
        teamId: team.id,
        title: issueContent.text,
        stateId: backlog.id,
        cycleId: cycle?.id,
        start: issueContent.start,
        end: issueContent.end,
      });

      await delay(200);
    }
  };

  return <SubIssueSelector onCreate={onCreateIssues} />;
};
