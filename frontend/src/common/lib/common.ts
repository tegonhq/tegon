/** Copyright (c) 2024, Tegon, all rights reserved. **/

/**
 * Checks whether the function is being invoked in Server or Client.
 * @returns True if this function is beinvoked in Next Server, False if it is in browser.
 */
export function isServer() {
  return typeof window === 'undefined';
}

export function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function groupBy<T extends Record<string, any>>(
  arr: T[],
  key: keyof T,
): Map<T[keyof T], T[]> {
  const groupedMap = new Map<T[keyof T], T[]>();
  for (const obj of arr) {
    const value = obj[key];
    if (value !== undefined) {
      const group = groupedMap.get(value);
      if (group) {
        group.push(obj);
      } else {
        groupedMap.set(value, [obj]);
      }
    }
  }
  return groupedMap;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function groupByKeyArray<T extends Record<string, any>>(
  arr: T[],
  key: keyof T,
): Map<string, T[]> {
  const groupedMap = new Map<string, T[]>();
  for (const obj of arr) {
    const values = obj[key] as string[]; // Asserting that values are an array of strings
    if (Array.isArray(values)) {
      for (const value of values) {
        const group = groupedMap.get(value);
        if (group) {
          group.push(obj);
        } else {
          groupedMap.set(value, [obj]);
        }
      }
    }
  }
  return groupedMap;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getUniqueValuesForKeys<T extends Record<string, any>>(
  arr: T[],
  keys: Array<keyof T>,
): Map<keyof T, Set<T[keyof T]>> {
  const uniqueValuesMap = new Map<keyof T, Set<T[keyof T]>>();

  // Iterate over the array once
  for (const obj of arr) {
    for (const key of keys) {
      const value = obj[key];
      if (value !== undefined) {
        let uniqueValues = uniqueValuesMap.get(key);
        if (!uniqueValues) {
          uniqueValues = new Set<T[keyof T]>();
          uniqueValuesMap.set(key, uniqueValues);
        }
        if (Array.isArray(value)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value.forEach((v: any) => uniqueValues!.add(v)); // Add each value to the Set
        } else {
          uniqueValues.add(value as T[keyof T]); // Add single value to the Set
        }
      }
    }
  }
  return uniqueValuesMap;
}
