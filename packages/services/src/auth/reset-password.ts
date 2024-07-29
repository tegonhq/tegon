import { useMutation } from 'react-query';
import { z } from 'zod';

import { ajaxPost } from '@tegonhq/services/utils';

interface UserInfo {
  status: string;
}

export const ResetPasswordSchema = z.object({
  password: z.string().min(4),
});

interface ResetPasswordProps extends z.infer<typeof ResetPasswordSchema> {
  token: string;
}

export function resetPassword(params: ResetPasswordProps) {
  return ajaxPost({
    url: `/api/v1/users/forgot_password/${params.token}`,
    data: {
      newPassword: params.password,
    },
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: UserInfo) => void;
  onError?: (error: string) => void;
}

export function useResetPasswordMutation({
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

  return useMutation(resetPassword, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
