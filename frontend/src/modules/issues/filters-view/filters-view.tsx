/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import React from 'react';

import { Button } from 'components/ui/button';
import { Filter } from 'icons';

import { useContextStore } from 'store/global-context-provider';

import { isEmpty } from './filter-utils';
import { Filters } from './filters';

interface FilterViewProps {
  Actions?: React.ReactElement;
}

export const FiltersView = observer(({ Actions }: FilterViewProps) => {
  const {
    applicationStore,
    applicationStore: { filters },
  } = useContextStore();
  const [filtersShow, setFiltersShow] = React.useState(!isEmpty(filters));

  React.useEffect(() => {
    if (!isEmpty(filters)) {
      setFiltersShow(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmpty(filters)]);

  const onClose = () => {
    applicationStore.clearFilters();
    setFiltersShow(false);
  };

  return (
    <div className="py-3 pt-6 pl-6 px-4 flex flex-col gap-2">
      <div className="flex justify-between">
        <Button
          variant="secondary"
          size="sm"
          isActive={filtersShow}
          onClick={() => setFiltersShow(true)}
        >
          <Filter size={16} className="mr-1" />
          Filter
        </Button>

        <div>{Actions}</div>
      </div>

      {filtersShow && (
        <div className="flex justify-start w-full">
          <Filters onClose={onClose} />
        </div>
      )}
    </div>
  );
});
