import type { ViewType } from 'common/types';

import { useUpdateViewMutation } from 'services/views';
import { Button } from '@tegonhq/ui/components/button';
import { Separator } from '@tegonhq/ui/components/separator';
import { useToast } from '@tegonhq/ui/components/use-toast';
import isEqual from 'lodash.isequal';
import { observer } from 'mobx-react-lite';

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
          <Button variant="secondary" onClick={onSave}>
            Save view
          </Button>
        </>
      )}
    </>
  );
});
