import { useMutation, useQueryClient } from 'react-query';

import type { WorkspaceType } from 'common/types';

import { GetUserQuery } from 'services/users';
import { ajaxPost } from 'services/utils';

export interface CreateInitialResourcesDto {
  workspaceName: string;
  fullname: string;
  teamName: string;
  teamIdentifier: string;
}

export function createInitialResources(
  createInitialResourcesDto: CreateInitialResourcesDto,
) {
  return ajaxPost({
    url: `/api/v1/workspaces/onboarding`,
    data: createInitialResourcesDto,
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: WorkspaceType) => void;
  onError?: (error: string) => void;
}

export function useCreateInitialResourcesMutation({
  onMutate,
  onSuccess,
  onError,
}: MutationParams) {
  const queryClient = useQueryClient();

  const onMutationTriggered = () => {
    onMutate && onMutate();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMutationError = (errorResponse: any) => {
    const errorText = errorResponse?.errors?.message || 'Error occured';

    onError && onError(errorText);
  };

  const onMutationSuccess = (data: WorkspaceType) => {
    queryClient.invalidateQueries({ queryKey: [GetUserQuery] });

    onSuccess && onSuccess(data);
  };

  return useMutation(createInitialResources, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
