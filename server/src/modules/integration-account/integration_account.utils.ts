/** Copyright (c) 2023, Poozle, all rights reserved. **/

import { IntegrationType } from '@prisma/client';

import { SyncPeriod } from '../sync/sync.util';

export const SYNC_SUPPORTED_CATEGORIES: IntegrationType[] = [
  IntegrationType.TICKETING,
  IntegrationType.PAYMENTS,
];

export function isSyncSupported(integrationType: IntegrationType): boolean {
  return SYNC_SUPPORTED_CATEGORIES.includes(integrationType);
}

export function syncParams(
  integrationType: IntegrationType,
  syncEnabled: boolean | undefined,
) {
  if (
    typeof syncEnabled === 'undefined' &&
    integrationType === IntegrationType.PAYMENTS
  ) {
    return {
      syncEnabled: true,
      syncPeriod: SyncPeriod.EVERY_HALF_HOUR,
    };
  }

  return {
    syncEnabled: !!syncEnabled,
  };
}
