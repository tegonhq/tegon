import type { ActionConfig } from '@tegonhq/types';

import { type UseQueryResult, useQuery } from 'react-query';

import { type XHRErrorResponse, ajaxGet } from 'services/utils';

/**
 * Query Key for Get user.
 */
const GetAllActions = 'getAllActions';

export interface ActionSource {
  name: string;
  slug: string;
  description: string;
  guide?: string;
  version: string;
  icon: string;
  config?: ActionConfig;
}

export function getAllActions() {
  return ajaxGet({
    url: '/api/v1/action/external',
  });
}

export function useGetAllActionsQuery(): UseQueryResult<
  ActionSource[],
  XHRErrorResponse
> {
  return useQuery([GetAllActions], () => getAllActions(), {
    retry: 1,
    staleTime: 1,
    refetchOnWindowFocus: false, // Frequency of Change would be Low
  });
}
