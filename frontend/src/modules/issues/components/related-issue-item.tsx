/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiCloseLine } from '@remixicon/react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';

import { WORKFLOW_CATEGORY_ICONS } from 'modules/team-settings/workflow/workflow-item';

import { cn } from 'common/lib/utils';
import type { IssueType } from 'common/types/issue';
import type { IssueRelationType } from 'common/types/issue-relation';

import { Button } from 'components/ui/button';
import { useCurrentTeam } from 'hooks/teams';
import { useAllTeamWorkflows } from 'hooks/workflows';

import { useDeleteIssueRelationMutation } from 'services/issue-relation';

interface RelatedIssueItemProps {
  issue: IssueType;
  relation: IssueRelationType;
}

export const RelatedIssueItem = observer(
  ({ issue, relation }: RelatedIssueItemProps) => {
    const currentTeam = useCurrentTeam();
    const workflows = useAllTeamWorkflows(currentTeam.identifier);
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
      <Button
        variant="outline"
        role="combobox"
        size="sm"
        onClick={() => {
          push(
            `/${workspaceSlug}/issue/${currentTeam.identifier}-${issue.number}`,
          );
        }}
        className={cn(
          'flex items-center gap-2 border group text-foreground dark:bg-transparent border-transparent hover:border-slate-200 dark:border-transparent dark:hover:border-slate-700 px-2 shadow-none justify-between text-sm font-normal focus-visible:ring-1 focus-visible:border-primary',
        )}
      >
        <CategoryIcon
          size={18}
          className="text-muted-foreground"
          color={workflow.color}
        />
        {`${currentTeam.identifier}-${issue.number}`}

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
      </Button>
    );
  },
);
