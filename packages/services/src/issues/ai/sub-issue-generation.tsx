import { useMutation } from 'react-query';

import { ajaxPost } from '@tegonhq/services/utils';

export interface SubIssueGenerationParams {
  description: string;
  workspaceId: string;
}

export function aiSubIssueGeneration({
  description,
  workspaceId,
}: SubIssueGenerationParams) {
  return ajaxPost({
    url: `/api/v1/issues/ai/subissues/generate`,
    data: {
      description,
      workspaceId,
      labelIds: [],
    },
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: string[]) => void;
  onError?: (error: string) => void;
}

export function useSubIssueGenerationMutation({
  onMutate,
  onSuccess,
  onError,
}: MutationParams) {
  const onMutationTriggered = () => {
    onMutate && onMutate();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMutationError = (errorResponse: any) => {
    const errorText = errorResponse?.errors?.message || 'Error occured';

    onError && onError(errorText);
  };

  const onMutationSuccess = (data: string[]) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(aiSubIssueGeneration, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
