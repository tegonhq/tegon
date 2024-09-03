import { ArrowRightIcon } from '@radix-ui/react-icons';
import { Button } from '@tegonhq/ui/components/button';
import { Separator } from '@tegonhq/ui/components/separator';
import { Actions } from '@tegonhq/ui/icons';

export function Announcement() {
  return (
    <Button
      variant="secondary"
      className="inline-flex items-center font-medium"
      onClick={() => {
        window.location.href = 'https://docs.tegon.ai/actions/overview';
      }}
    >
      <Actions className="h-4 w-4" />
      <Separator className="mx-2 h-4" orientation="vertical" />
      <span className="underline-offset-4">Introducing Actions</span>
      <ArrowRightIcon className="ml-1 h-4 w-4" />
    </Button>
  );
}
