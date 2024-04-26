/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import React from 'react';

import { NewViewDialog } from 'modules/views/new-view-dialog';

import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';

import { useContextStore } from 'store/global-context-provider';

import { isEmpty } from './filter-utils';

export const SaveViewActions = observer(() => {
  const { applicationStore } = useContextStore();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const filters = applicationStore.filters;

  const clearFilters = () => {
    applicationStore.clearFilters();
  };

  return (
    <>
      {!isEmpty(filters) && (
        <>
          <Separator orientation="vertical" />
          <Button variant="ghost" size="xs" onClick={clearFilters}>
            Clear
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setDialogOpen(true)}
          >
            Save
          </Button>
        </>
      )}

      <NewViewDialog open={dialogOpen} setOpen={setDialogOpen} />
    </>
  );
});
