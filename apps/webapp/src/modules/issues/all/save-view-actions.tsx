import { Button } from '@tegonhq/ui/components/button';
import { Separator } from '@tegonhq/ui/components/separator';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { NewViewDialog } from 'modules/views/new-view-dialog';

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

          <Button variant="secondary" onClick={() => setDialogOpen(true)}>
            Save as view
          </Button>
        </>
      )}

      <NewViewDialog open={dialogOpen} setOpen={setDialogOpen} />
    </>
  );
});
