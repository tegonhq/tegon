import type { IssueType } from '@tegonhq/types';
import type { WorkflowType } from '@tegonhq/types';

import { WORKFLOW_CATEGORY_ICONS } from '@tegonhq/types';
import { buttonVariants } from '@tegonhq/ui/components/button';
import { cn } from '@tegonhq/ui/lib/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { getWorkflowColor } from 'common/status-color';

import { useCurrentTeam } from 'hooks/teams';
import { useTeamWorkflows } from 'hooks/workflows';

interface ParentIssueViewProps {
  issue: IssueType;
}

export function ParentIssueView({ issue }: ParentIssueViewProps) {
  const team = useCurrentTeam();
  const { workspaceSlug } = useParams();
  const workflows = useTeamWorkflows(team.identifier);

  const workflow = workflows.find(
    (wk: WorkflowType) => wk.id === issue.parent.stateId,
  );

  const CategoryIcon = WORKFLOW_CATEGORY_ICONS[workflow.name];

  return (
    <Link
      className={cn(
        'cursor-pointer max-w-[600px] rounded-md flex gap-2 items-center bg-grayAlpha-100',
        buttonVariants({ variant: 'secondary' }),
        'w-fit p-2',
      )}
      href={`/${workspaceSlug}/issue/${team.identifier}-${issue.parent.number}`}
    >
      Sub-issue of
      <CategoryIcon
        size={20}
        className="text-muted-foreground"
        color={getWorkflowColor(workflow).color}
      />
      <div className="text-muted-foreground font-mono">
        {team.identifier}-{issue.parent.number}
      </div>
      <div className="max-w-[300px]">
        <div className="truncate">{issue.parent.title}</div>
      </div>
    </Link>
  );
}
