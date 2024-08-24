import type { IntegrationDefinition } from '@tegonhq/types';

import { getIntegrationDefinitions } from '@tegonhq/services';
import { type UseQueryResult, useQuery } from 'react-query';

import { type XHRErrorResponse } from 'services/utils';

/**
 * Query Key for Get user.
 */
const GetIntegrationDefinitions = 'getIntegrationDefinitions';

export function useGetIntegrationDefinitions(
  workspaceId: string,
): UseQueryResult<IntegrationDefinition[], XHRErrorResponse> {
  return useQuery(
    [GetIntegrationDefinitions, workspaceId],
    () => getIntegrationDefinitions({ workspaceId }),
    {
      retry: 1,
      staleTime: 100000,
      refetchOnWindowFocus: false, // Frequency of Change would be Low
    },
  );
}
