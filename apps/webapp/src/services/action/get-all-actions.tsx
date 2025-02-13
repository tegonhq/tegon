import type { ActionConfig } from '@tegonhq/types';

import { type UseQueryResult, useQuery } from 'react-query';

import { type XHRErrorResponse, ajaxGet } from 'services/utils';

export interface ActionExternalConfig extends ActionConfig {
  version: string;
}

/**
 * Query Key for Get user.
 */
const GetAllActions = 'getAllActions';

export function getAllActions() {
  return ajaxGet({
    url: '/api/v1/action/external',
  });
}

export function useGetAllActionsQuery(): UseQueryResult<
  ActionExternalConfig[],
  XHRErrorResponse
> {
  return useQuery([GetAllActions], () => getAllActions(), {
    retry: 1,
    staleTime: 1,
    refetchOnWindowFocus: false, // Frequency of Change would be Low
  });
}
