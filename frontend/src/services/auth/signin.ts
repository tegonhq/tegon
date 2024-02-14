/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { ajaxPost } from 'lib/ajax';
import { useMutation } from 'react-query';
import { z } from 'zod';

export interface SignInParams {
  email: string;
  password: string;
}

export interface UserInfo {
  status: string;
  user: User;
}

export interface User {
  email: string;
  id: string;
  timeJoined: number;
}

export const SignInSchema = z.object({
  email: z.string().email('This is not a valid email').min(2).max(50),
  password: z.string().min(4),
});

export function siginUser(params: z.infer<typeof SignInSchema>) {
  return ajaxPost({
    url: '/api/auth/signin',
    data: {
      formFields: [
        {
          id: 'email',
          value: params.email,
        },
        {
          id: 'password',
          value: params.password,
        },
      ],
    },
  });
}

export interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: UserInfo) => void;
  onError?: (error: string) => void;
}

export function useSignInMutation({
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

  return useMutation(siginUser, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
