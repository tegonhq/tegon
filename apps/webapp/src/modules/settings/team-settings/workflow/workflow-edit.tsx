import type { WorkflowCategoryEnum } from '@tegonhq/types';

import type { WorkflowType } from 'common/types';

import { useCurrentTeam } from 'hooks/teams';

import { useUpdateWorkflowMutation } from 'services/workflow';

import { WorfklowForm } from './workflow-form';

interface WorkflowEditProps {
  category: WorkflowCategoryEnum;
  onCancel: () => void;
  workflow: WorkflowType;
}

export function WorkflowEdit({
  category,
  onCancel,
  workflow,
}: WorkflowEditProps) {
  const team = useCurrentTeam();

  const { mutate: updateWorkflow, isLoading } = useUpdateWorkflowMutation({
    onSuccess: () => {
      onCancel();
    },
  });

  const onSubmit = async (name: string, description: string, color: string) => {
    updateWorkflow({
      teamId: team.id,
      workflowId: workflow.id,
      name,
      description,
      color,
      category,
      position: 1,
    });
  };

  return (
    <WorfklowForm
      submit={onSubmit}
      category={category}
      onCancel={onCancel}
      isLoading={isLoading}
      workflow={workflow}
    />
  );
}
