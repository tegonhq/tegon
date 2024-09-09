import type { ActionConfig } from '@tegonhq/types';

import { getActionInputs } from '@tegonhq/services';
import { type UseQueryResult, useQuery } from 'react-query';

import { type XHRErrorResponse } from 'services/utils';

/**
 * Query Key for Get user.
 */
const GetActionInputs = 'getActionInputs';

export function useGetActionInputsQuery(
  slug: string,
  workspaceId: string,
): UseQueryResult<ActionConfig['inputs'], XHRErrorResponse> {
  return useQuery(
    [GetActionInputs, slug, workspaceId],
    () => getActionInputs({ slug, workspaceId }),
    {
      retry: 1,
      staleTime: 10000,
      refetchOnWindowFocus: false, // Frequency of Change would be Low
    },
  );
}
