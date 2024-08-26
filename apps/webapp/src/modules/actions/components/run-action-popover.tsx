import { Button } from '@tegonhq/ui/components/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { Textarea } from '@tegonhq/ui/components/textarea';
import { useToast } from '@tegonhq/ui/components/use-toast';
import React from 'react';

import { useCurrentWorkspace } from 'hooks/workspace';

import { useRunActionMutation } from 'services/action';

interface RunActionPopoverProps {
  slug: string;
}

export function RunActionPopover({ slug }: RunActionPopoverProps) {
  const [payload, setPayload] = React.useState('');
  const workspace = useCurrentWorkspace();
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const { mutate: runAction } = useRunActionMutation({
    onSuccess: () => {
      toast({
        title: 'Action status',
        description: 'Action has been triggered',
      });
    },
  });

  const onRun = () => {
    runAction({
      slug,
      payload: JSON.parse(payload),
      workspaceId: workspace.id,
    });
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
