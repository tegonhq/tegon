import { useMutation } from 'react-query';

import type { User } from 'common/types';

import { ajaxPost } from 'services/utils';

export interface UpdateUserParams {
  fullname: string;
  username: string;
  userId: string;
}

function updateUser({ userId, fullname, username }: UpdateUserParams) {
  return ajaxPost({
    url: `/api/v1/users/${userId}`,
    data: {
      fullname,
      username,
    },
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: User) => void;
  onError?: (error: string) => void;
}

export function useUpdateUserMutation({
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

  const onMutationSuccess = (data: User) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(updateUser, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
