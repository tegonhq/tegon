// interface ActionCardProps {}

import { Button } from '@tegonhq/ui/components/button';
import { Actions } from '@tegonhq/ui/icons';

export function ActionCard() {
  return (
    <div className="flex flex-col p-3 bg-background-3 rounded gap-1">
      <div className="flex">
        <div className="p-1 border border-border rounded">
          <Actions size={20} />
        </div>
      </div>
      <div className="font-semibold">Weekly Project Progress Report</div>
      <div className="text-muted-foreground">
        Automate your pull request and commit workflows and keep issues synced
        both ways
      </div>
      <div>
        <Button variant="secondary" size="lg">
          Install action
        </Button>
      </div>
    </div>
  );
}
