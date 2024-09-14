import { AvatarText } from '@tegonhq/ui/components/avatar';
import { Button } from '@tegonhq/ui/components/button';
import { ArrowDownRight, DeleteLine } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import React from 'react';
import {
  useWatch,
  type UseFormReturn,
  type UseFieldArrayRemove,
} from 'react-hook-form';

import { getWorkflowColor } from 'common/status-color';
import type { WorkflowType } from 'common/types';
import type { User } from 'common/types';
import { getWorkflowIcon } from 'common/workflow-icons';

import { useUsersData } from 'hooks/users';

import { useContextStore } from 'store/global-context-provider';

interface IssueCollapseViewProps {
  isSubIssue: boolean;
  index: number;
  form: UseFormReturn;
  subIssueOperations: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    append: any;
    remove: UseFieldArrayRemove;
  };
}

export const IssueCollapseView = observer(
  ({ form, index, isSubIssue, subIssueOperations }: IssueCollapseViewProps) => {
    const values = useWatch({
      control: form.control,
      name: `issues.${index}`,
    });
    const { workflowsStore, teamsStore } = useContextStore();
    const team = teamsStore.getTeamWithId(values.teamId);
    const { users, isLoading } = useUsersData();

    const workflows = workflowsStore.getWorkflowsForTeam(values.teamId);
    const currentWorkflow = values.stateId
      ? workflows.find(
          (workflow: WorkflowType) => workflow.id === values.stateId,
        )
      : workflows[0];

    const CategoryIcon = getWorkflowIcon(currentWorkflow);

    function getUserData(userId: string) {
      if (userId === 'no-user') {
        return { username: 'No Assignee', fullname: 'No Assignee' };
      }

      return users.find((userData: User) => userData.id === userId);
    }

    if (isLoading) {
      return null;
    }

    return (
      <div
        className={cn(
          'flex gap-2 w-full p-1 px-4 items-center justify-between min-h-10',
        )}
      >
        <div className="flex gap-2 w-full">
          <p>
            {isSubIssue ? (
              <div className="flex gap-2">
                <ArrowDownRight size={20} />
                Sub-issue
              </div>
            ) : (
              'Issue'
            )}
          </p>

          <CategoryIcon
            size={20}
            color={currentWorkflow && getWorkflowColor(currentWorkflow).color}
          />

          {team && (
            <p className="text-muted-foreground font-mono">
              {team?.identifier}{' '}
            </p>
          )}
          <span className="flex items-center justify-start shrink min-w-[0px] max-w-[200px]">
            <span className="text-left truncate">{values.title}</span>
          </span>

          {values.assigneeId && (
            <>
              <span>-</span>
              <AvatarText
                className="h-5 w-5 text-[9px]"
                text={getUserData(values.assigneeId).fullname}
              />
              {getUserData(values.assigneeId).fullname}
            </>
          )}
        </div>

        {isSubIssue && (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Button
              variant="ghost"
              onClick={() => {
                subIssueOperations.remove(index);
              }}
            >
              <DeleteLine size={16} />
            </Button>
          </div>
        )}
      </div>
    );
  },
);
