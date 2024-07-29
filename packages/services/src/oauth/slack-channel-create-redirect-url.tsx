import { useMutation } from 'react-query';

import { ajaxPost } from '@tegonhq/services/utils';

export interface SlackChannelCreateRedirectURLParams {
  integrationAccountId: string;
  redirectURL: string;
}

interface RedirectURLResponse {
  status: number;
  redirectURL: string;
}

export function slackChannelCreateRedirectURL(
  params: SlackChannelCreateRedirectURLParams,
) {
  return ajaxPost({
    url: `/api/v1/slack/channel/redirect?integrationAccountId=${params.integrationAccountId}`,
    data: {
      redirectURL: params.redirectURL,
    },
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: RedirectURLResponse) => void;
  onError?: (error: string) => void;
}

export function useSlackChannelCreateRedirectURLMutation({
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

  const onMutationSuccess = (data: RedirectURLResponse) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(slackChannelCreateRedirectURL, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
