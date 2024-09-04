import { AsyncLocalStorage } from 'async_hooks';

import { Injectable } from '@nestjs/common';

// Global instance of AsyncLocalStorage such that it can be shared across the service
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ASYNC_LOCAL_STORAGE = new AsyncLocalStorage<Map<string, any>>();

@Injectable()
export class ALSService {
  static readonly asyncLocalStorage = ASYNC_LOCAL_STORAGE;

  /**
   *
   * @param context  async local storage default context
   * @param callback callback function which will use the context
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run(context: Map<string, any>, callback: () => void) {
    ALSService.asyncLocalStorage.run(context, callback);
  }

  /**
   *
   * @param key key which need to be fetched from ALS.
   * @returns value of type T.
   */
  get<T>(key: string): T | undefined {
    const store = ALSService.asyncLocalStorage.getStore();
    return store ? store.get(key) : undefined;
  }

  /**
   *
   * @param key key which need to be set in ALS
   * @param value value which need to be set in ALS with type T
   */
  set<T>(key: string, value: T) {
    const store = ALSService.asyncLocalStorage.getStore();
    if (store) {
      store.set(key, value);
    }
  }
}

// singleton instance of ALS service.
export const ALS_SERVICE_INSTANCE = new ALSService();
