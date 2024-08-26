import { Button } from '@tegonhq/ui/components/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { Textarea } from '@tegonhq/ui/components/textarea';
import React from 'react';

import { useRunActionMutation } from 'services/action';

interface RunActionPopoverProps {
  slug: string;
}

export function RunActionPopover({ slug }: RunActionPopoverProps) {
  const [payload, setPayload] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const { mutate: runAction } = useRunActionMutation({});

  const onRun = () => {
    runAction({ slug, payload: JSON.parse(payload) });
    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="lg">
          Create test run
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex flex-col gap-2">
          <Textarea
            value={payload}
            onChange={(e) => setPayload(e.currentTarget.value)}
          />

          <div className="flex justify-end">
            <Button variant="secondary" onClick={onRun}>
              Trigger
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
