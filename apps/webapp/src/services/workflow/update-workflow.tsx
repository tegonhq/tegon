import type { Workflow } from '@tegonhq/types';

import { updateWorkflow, type UpdateWorkflowInput } from '@tegonhq/services';
import { useMutation } from 'react-query';

import { useContextStore } from 'store/global-context-provider';

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: Workflow) => void;
  onError?: (error: string) => void;
}

export function useUpdateWorkflowMutation({
  onMutate,
  onSuccess,
  onError,
}: MutationParams) {
  const { workflowsStore } = useContextStore();

  const update = ({ workflowId, ...otherParams }: UpdateWorkflowInput) => {
    const workflow = workflowsStore.getWorkflowWithId(workflowId);

    try {
      workflowsStore.update(
        { ...workflow, position: otherParams.position },
        workflowId,
      );

      return updateWorkflow({ ...otherParams, workflowId });
    } catch (e) {
      workflowsStore.update(workflow, workflowId);
      return undefined;
    }
  };

  const onMutationTriggered = () => {
    onMutate && onMutate();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMutationError = (errorResponse: any) => {
    const errorText = errorResponse?.errors?.message || 'Error occured';

    onError && onError(errorText);
  };

  const onMutationSuccess = (data: Workflow) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(update, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
