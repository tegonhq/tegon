import { Button } from '@tegonhq/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tegonhq/ui/components/dropdown-menu';
import { useToast } from '@tegonhq/ui/components/use-toast';
import { MoreLine } from '@tegonhq/ui/icons';

import {
  useCancelActionRunMutation,
  useReplayActionRunMutation,
  type TriggerRun,
} from 'services/action';

interface RunOptionsDropdownProps {
  run: TriggerRun;
}

export function RunOptionsDropdown({ run }: RunOptionsDropdownProps) {
  const showCancel = [
    'WAITING_FOR_DEPLOY',
    'QUEUED',
    'EXECUTING',
    'REATTEMPTING',
  ].includes(run.status);
  const { toast } = useToast();
  const { mutate: replayRun } = useReplayActionRunMutation({
    onSuccess: () => {
      toast({
        title: 'Run success',
        description: 'Replay of run is successfull',
      });
    },
  });

  const { mutate: cancelRun } = useCancelActionRunMutation({
    onSuccess: () => {
      toast({
        title: 'Run success',
        description: 'Replay of run is successfull',
      });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <MoreLine />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {!showCancel && (
          <DropdownMenuItem
            onClick={() => {
              replayRun({
                slug: run.action.slug,
                runId: run.id,
              });
            }}
          >
            Replay
          </DropdownMenuItem>
        )}
        {showCancel && (
          <DropdownMenuItem
            onClick={() => {
              cancelRun({
                slug: run.action.slug,
                runId: run.id,
              });
            }}
          >
            Cancel
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
