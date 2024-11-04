import { FilterTypeEnum, type ApplicationStoreType } from 'store/application';

export const applyFilters = (
  filterType: FilterTypeEnum,
  field: string,
  value: string,
  currentFilters: string[],
  applicationStore: ApplicationStoreType,
) => {
  if (currentFilters.includes(value)) {
    const newValue = currentFilters.filter((id: string) => id !== value);

    if (newValue.length === 0) {
      return applicationStore.deleteFilter(field);
    }

    // Remove the value from the filter if it already exists
    applicationStore.updateFilters({
      [field]: {
        filterType,
        value: currentFilters.filter((id: string) => id !== value), // Remove the value
      },
    });
  } else {
    // Add the value to the filter if it doesn't exist
    applicationStore.updateFilters({
      [field]: {
        filterType,
        value: [...currentFilters, value], // Add the value
      },
    });
  }
};
