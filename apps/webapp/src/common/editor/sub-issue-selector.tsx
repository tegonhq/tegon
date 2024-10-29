import { WorkflowCategoryEnum } from '@tegonhq/types';
import { Button } from '@tegonhq/ui/components/button';
import { useEditor } from '@tegonhq/ui/components/editor/index';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@tegonhq/ui/components/tooltip';
import { SubIssue } from '@tegonhq/ui/icons';
import { useRouter } from 'next/router';

import type { IssueType, WorkflowType } from 'common/types';

import { useProject } from 'hooks/projects';
import { useCurrentTeam, useTeamWithId } from 'hooks/teams';

import { useCreateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function getUrlFromString(str: string) {
  if (isValidUrl(str)) {
    return str;
  }
  try {
    if (str.includes('.') && !str.includes(' ')) {
      return new URL(`https://${str}`).toString();
    }
  } catch (e) {
    return null;
  }

  return null;
}

export const SubIssueSelector = () => {
  const { editor } = useEditor();
  const { query } = useRouter();
  const cTeam = useCurrentTeam();
  const project = useProject();
  const teamId = cTeam ? cTeam.id : project.teams[0];
  const team = useTeamWithId(teamId);
  const { workflowsStore } = useContextStore();

  const { mutate: createIssue } = useCreateIssueMutation({
    onSuccess: (issue: IssueType) => {
      const url = `http://app.tegon.ai/${query.workspaceSlug}/issue/${team.identifier}-${issue.number}`;

      const selection = editor.view.state.selection;
      editor
        .chain()
        .focus()
        .insertContentAt(
          {
            from: selection.from,
            to: selection.to,
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
  });

  if (!editor) {
    return null;
  }

  const createSubIssue = () => {
    const selection = editor.view.state.selection;
    const text = editor.state.doc.textBetween(selection.from, selection.to);

    const workflows = workflowsStore.getWorkflowsForTeam(team.id);
    const backlog = workflows.find(
      (workflow: WorkflowType) =>
        workflow.category === WorkflowCategoryEnum.BACKLOG,
    );

    createIssue({
      description: text,
      teamId: team.id,
      stateId: backlog.id,
      projectId: project?.id,
    });
  };

  return (
    <div className="flex">
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="ghost"
            onClick={createSubIssue}
            className="gap-2 rounded border-none hover:bg-accent hover:text-accent-foreground"
          >
            <SubIssue size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Create sub-issues</TooltipContent>
      </Tooltip>
    </div>
  );
};
