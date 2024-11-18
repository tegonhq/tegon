import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@tegonhq/ui/components/tooltip';
import { CalendarLine, Fire } from '@tegonhq/ui/icons';
import { differenceInDays, format } from 'date-fns';

interface IssueDueDateProps {
  dueDate: string;
}

export function IssueDueDate({ dueDate }: IssueDueDateProps) {
  if (!dueDate) {
    return null;
  }

  const today = new Date();
  const dueDateObj = new Date(dueDate);

  if (dueDateObj < today) {
    const diffDays = differenceInDays(today, dueDateObj);

    return (
      <div className="inline-flex min-w-[50px] text-xs items-center text-red-600">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex">
              <Fire /> &nbsp; {diffDays}d
            </div>
          </TooltipTrigger>
          <TooltipContent className="p-2">
            Overdue by {diffDays} days
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="inline-flex min-w-[70px] text-xs gap-1 items-center">
      <CalendarLine /> &nbsp;
      {format(new Date(dueDate), 'd MMM')}
    </div>
  );
}
