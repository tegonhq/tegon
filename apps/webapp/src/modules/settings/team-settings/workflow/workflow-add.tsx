import type { WorkflowCategoryEnum } from '@tegonhq/types';

import { useCurrentTeam } from 'hooks/teams';

import { useCreateWorkflowMutation } from 'services/workflow';

import { useContextStore } from 'store/global-context-provider';

import { WorfklowForm } from './workflow-form';

interface WorkflowAddProps {
  category: WorkflowCategoryEnum;
  onCancel: () => void;
}

export function WorkflowAdd({ category, onCancel }: WorkflowAddProps) {
  const team = useCurrentTeam();
  const { workflowsStore } = useContextStore();

  const { mutate: createWorkflow, isLoading } = useCreateWorkflowMutation({
    onSuccess: () => {
      onCancel();
    },
  });

  const onSubmit = async (name: string, description: string, color: string) => {
    createWorkflow({
      teamId: team.id,
      name,
      description,
      color,
      category,
      position: workflowsStore.getPositionForCategory(category, team.id),
    });
  };

  return (
    <WorfklowForm
      submit={onSubmit}
      category={category}
      onCancel={onCancel}
      isLoading={isLoading}
    />
  );
}
