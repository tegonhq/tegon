/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { FiltersModelType } from 'store/application';

export function isEmpty(filters: FiltersModelType) {
  if (Object.keys(filters).length === 0) {
    return true;
  }

  let isEmpty = true;
  Object.keys(filters).forEach((key: keyof FiltersModelType) => {
    if (filters[key] !== undefined) {
      isEmpty = false;
    }
  });

  return isEmpty;
}
