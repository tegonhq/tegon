import { useMutation } from 'react-query';

import type { IssueType } from 'common/types';

import { ajaxPost } from 'services/utils';

export interface AIFilterIssuesParams {
  text: string;
  teamId?: string;

  workspaceId: string;
}

export function aiFilterIssues(data: AIFilterIssuesParams) {
  return ajaxPost({
    url: `/api/v1/issues/ai/ai_filters`,
    data,
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: IssueType) => void;
  onError?: (error: string) => void;
}

export function useAIFilterIssuesMutation({
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

  return useMutation(aiFilterIssues, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
