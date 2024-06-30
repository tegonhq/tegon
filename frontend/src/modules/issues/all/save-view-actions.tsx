/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import React from 'react';

import { NewViewDialog } from 'modules/views/new-view-dialog';

import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';

import { useContextStore } from 'store/global-context-provider';

import { isEmpty } from '../filters-view/filter-utils';

export const SaveViewActions = observer(() => {
  const { applicationStore } = useContextStore();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const filters = applicationStore.filters;

  return (
    <>
      {!isEmpty(filters) && (
        <>
          <Separator orientation="vertical" />

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDialogOpen(true)}
          >
            Save as view
          </Button>
        </>
      )}

      <NewViewDialog open={dialogOpen} setOpen={setDialogOpen} />
    </>
  );
});
