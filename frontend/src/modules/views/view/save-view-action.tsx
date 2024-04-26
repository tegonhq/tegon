/** Copyright (c) 2024, Tegon, all rights reserved. **/

import isEqual from 'lodash.isequal';
import { observer } from 'mobx-react-lite';

import type { ViewType } from 'common/types/view';

import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';
import { useToast } from 'components/ui/use-toast';

import { useUpdateViewMutation } from 'services/views';

import { useContextStore } from 'store/global-context-provider';

interface SaveViewActionProps {
  view: ViewType;
}

export const SaveViewAction = observer(({ view }: SaveViewActionProps) => {
  const { applicationStore } = useContextStore();
  const { toast } = useToast();

  const filters = applicationStore.filters;
  const { mutate: updateView } = useUpdateViewMutation({
    onSuccess: () => {
      toast({
        title: `Your view was successfully updated`,
      });
    },
  });

  const clearFilters = () => {
    applicationStore.clearFilters();
  };

  const onSave = () => {
    updateView({
      viewId: view.id,
      filters,
    });
  };

  return (
    <>
      {!isEqual(view.filters, filters) && (
        <>
          <Separator orientation="vertical" />
          <Button variant="ghost" size="xs" onClick={clearFilters}>
            Clear
          </Button>
          <Button variant="outline" size="xs" onClick={onSave}>
            Save
          </Button>
        </>
      )}
    </>
  );
});
