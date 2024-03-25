/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useMutation } from 'react-query';

import { ajaxPost } from 'common/lib/ajax';
import type { IssueType } from 'common/types/issue';

export interface CreateIssueParams {
  title: string;
  description: string;
  priority?: number;

  labelIds?: string[];
  stateId: string;
  assigneeId?: string;
  teamId: string;
  parentId?: string;
}

export function createIssue({ teamId, ...otherParams }: CreateIssueParams) {
  return ajaxPost({
    url: `/api/v1/issues?teamId=${teamId}`,
    data: {
      ...otherParams,
      sortOrder: 0,
      estimate: 0,
      subscriberIds: [],
    },
  });
}

export interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: IssueType) => void;
  onError?: (error: string) => void;
}

export function useCreateIssueMutation({
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

  return useMutation(createIssue, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
