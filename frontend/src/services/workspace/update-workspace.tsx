/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useMutation } from 'react-query';

import { ajaxPost } from 'common/lib/ajax';
import type { WorkspaceType } from 'common/types/workspace';

export interface UpdateWorkspaceParams {
  name: string;
  workspaceId: string;
}

export function updateWorkspace({ workspaceId, name }: UpdateWorkspaceParams) {
  return ajaxPost({
    url: `/api/v1/workspaces/${workspaceId}`,
    data: { name },
  });
}

export interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: WorkspaceType) => void;
  onError?: (error: string) => void;
}

export function useUpdateWorkspaceMutation({
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

  const onMutationSuccess = (data: WorkspaceType) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(updateWorkspace, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
