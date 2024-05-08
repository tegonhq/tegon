/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useMutation } from 'react-query';
import { z } from 'zod';

import { ajaxPost } from 'common/lib/ajax';

interface UserInfo {
  status: string;
}

export const RequestForgotPasswordSchema = z.object({
  email: z.string().email('This is not a valid email').min(2).max(50),
});

export function requestForgotPassword(
  params: z.infer<typeof RequestForgotPasswordSchema>,
) {
  return ajaxPost({
    url: '/api/v1/users/forgot_password',
    data: {
      email: params.email,
    },
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: UserInfo) => void;
  onError?: (error: string) => void;
}

export function useRequestForgotPasswordMutation({
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

  const onMutationSuccess = (data: UserInfo) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(requestForgotPassword, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
