import { RiCloseLine } from '@remixicon/react';
import { Button } from '@tegonhq/ui/components/button';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';

import { getWorkflowColor } from 'common/status-color';
import type { IssueType } from 'common/types/issue';
import type { IssueRelationType } from 'common/types/issue-relation';
import { WORKFLOW_CATEGORY_ICONS } from 'common/types/status';

import { useTeamWithId } from 'hooks/teams';
import { useAllWorkflows } from 'hooks/workflows';

import { useDeleteIssueRelationMutation } from 'services/issue-relation';

interface RelatedIssueItemProps {
  issue: IssueType;
  relation: IssueRelationType;
}

export const RelatedIssueItem = observer(
  ({ issue, relation }: RelatedIssueItemProps) => {
    const team = useTeamWithId(issue.teamId);
    const workflows = useAllWorkflows();
    const workflow = workflows.find(
      (workflow) => workflow.id === issue.stateId,
    );

    const {
      push,
      query: { workspaceSlug },
    } = useRouter();

    const { mutate: deleteIssueRelation } = useDeleteIssueRelationMutation({});

    const CategoryIcon = WORKFLOW_CATEGORY_ICONS[workflow.name];

    const deleteRelation = () => {
      deleteIssueRelation({
        issueRelationId: relation.id,
      });
    };

    return (
      <div className="flex gap-1 group">
        <Button
          variant="ghost"
          onClick={() => {
            push(`/${workspaceSlug}/issue/${team.identifier}-${issue.number}`);
          }}
          className={cn(
            'flex gap-2 px-0 hover:px-0 shadow-none justify-start font-normal focus-visible:ring-1 focus-visible:border-primary',
          )}
        >
          <CategoryIcon size={18} color={getWorkflowColor(workflow).color} />
          {`${team.identifier}-${issue.number}`}
        </Button>
        <Button
          variant="ghost"
          className="p-0 !bg-transparent"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <RiCloseLine
            size={14}
            onClick={deleteRelation}
            className="text-muted-foreground group-hover:block hidden"
          />
        </Button>
      </div>
    );
  },
);
