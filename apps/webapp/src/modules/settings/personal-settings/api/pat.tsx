import { Pat as PatI } from '@tegonhq/types';
import { Button } from '@tegonhq/ui/components/button';

import { useDeletePatMutation } from 'services/users';

interface PatProps {
  pat: PatI;
}

export function Pat({ pat }: PatProps) {
  const { mutate } = useDeletePatMutation({});

  return (
    <div
      className="group flex justify-between mb-2 bg-background-3 rounded-lg p-2 px-4"
      key={pat.id}
    >
      <div className="flex items-center justify-center gap-3">
        <div>{pat.name}</div>
      </div>

      <div>
        <Button
          variant="secondary"
          onClick={() => {
            mutate({ patId: pat.id });
          }}
        >
          revoke
        </Button>
      </div>
    </div>
  );
}
