import { Button } from '@tegonhq/ui/components/button';
import { Textarea } from '@tegonhq/ui/components/textarea';
import { SendLine } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import { AI as AII } from '@tegonhq/ui/icons';

export const AI = observer(() => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center items-center gap-2 p-3 px-5">
        <AII />
        Tegon AI
      </div>
      <div className="grow"></div>

      <div className="p-3 px-5 relative">
        <Textarea
          className="bg-transparent border border-border max-h-[500px]"
          rows={4}
          autoFocus
          placeholder="Ask AI anything..."
        />
        <Button
          variant="ghost"
          className="transition-all duration-500 ease-in-out my-2 absolute bottom-2 right-5"
          type="submit"
        >
          <SendLine size={20} />
        </Button>
      </div>
    </div>
  );
});
