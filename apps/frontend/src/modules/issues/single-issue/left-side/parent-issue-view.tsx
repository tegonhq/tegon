import Link from 'next/link';
import { useParams } from 'next/navigation';

import { cn } from 'common/lib/utils';
import { getWorkflowColor } from 'common/status-color';
import type { IssueType } from 'common/types/issue';
import { WORKFLOW_CATEGORY_ICONS } from 'common/types/status';
import type { WorkflowType } from 'common/types/team';

import { buttonVariants } from 'components/ui/button';
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
