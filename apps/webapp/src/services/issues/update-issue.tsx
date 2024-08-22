import { useMutation } from 'react-query';

import type { IssueType, IssueRelationEnum } from 'common/types';

import { ajaxPost } from 'services/utils';

export interface UpdateIssueParams {
  id: string;
  title?: string;
  description?: string;
  priority?: number;

  labelIds?: string[];
  dueDate?: Date;
  stateId?: string;
  assigneeId?: string;
  teamId: string;

  parentId?: string;

  issueRelation?: {
    issueId: string;
    relatedIssueId: string;
    type: IssueRelationEnum;
  };
}

export function updateIssue({ id, teamId, ...otherParams }: UpdateIssueParams) {
  return ajaxPost({
    url: `/api/v1/issues/${id}?teamId=${teamId}`,
    data: otherParams,
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: IssueType) => void;
  onError?: (error: string) => void;
}

export function useUpdateIssueMutation({
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

  return useMutation(updateIssue, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
