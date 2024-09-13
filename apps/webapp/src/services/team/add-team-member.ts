import { addTeamMember } from '@tegonhq/services';
import { useMutation } from 'react-query';

import type { TeamType } from 'common/types';

export interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: TeamType) => void;
  onError?: (error: string) => void;
}

export function useAddTeamMemberMutation({
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

  const onMutationSuccess = (data: TeamType) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(addTeamMember, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
