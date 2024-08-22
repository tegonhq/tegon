import type { IntegrationDefinition } from 'common/types';

import { getIntegrationDefinition } from '@tegonhq/services';
import { type UseQueryResult, useQuery } from 'react-query';

import { type XHRErrorResponse } from 'services/utils';

/**
 * Query Key for Get user.
 */
const GetIntegrationDefinition = 'getIntegrationDefinition';

export function useGetIntegrationDefinition(
  integrationDefinitionId: string,
): UseQueryResult<IntegrationDefinition, XHRErrorResponse> {
  return useQuery(
    [GetIntegrationDefinition, integrationDefinitionId],
    () => getIntegrationDefinition({ integrationDefinitionId }),
    {
      retry: 1,
      staleTime: 1,
      refetchOnWindowFocus: false, // Frequency of Change would be Low
    },
  );
}
