import type { IssueType } from '@tegonhq/types';

import { useMutation } from 'react-query';

import { ajaxPost } from '@tegonhq/services/utils';

export interface AITitleParams {
  description: string;
  workspaceId: string;
}

export function aiTitleIssues({ description, workspaceId }: AITitleParams) {
  return ajaxPost({
    url: `/api/v1/issues/ai/ai_title`,
    data: {
      description,
      workspaceId,
    },
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: IssueType) => void;
  onError?: (error: string) => void;
}

export function useAITitleMutation({
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

  const onMutationSuccess = (data: IssueType) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(aiTitleIssues, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
