import { RiClipboardLine } from '@remixicon/react';
import { Button } from '@tegonhq/ui/components/button';
import { Input } from '@tegonhq/ui/components/input';
import copy from 'copy-to-clipboard';
import * as React from 'react';

import { useCreatePatMutation } from 'services/users/create-pat';

interface NewLabelProps {
  onCancel: () => void;
  teamId?: string;
}

export function CreatePat({ onCancel }: NewLabelProps) {
  const [labelName, setLabelName] = React.useState('');

  const { mutate: createPat, data, isLoading } = useCreatePatMutation({});

  const onSubmit = async () => {
    createPat({
      name: labelName,
    });
  };

  return (
    <div className="group flex justify-between mb-2 bg-background-3 rounded p-2 px-4">
      {!data && (
        <div className="flex items-center justify-center gap-3 w-full">
          <div className="grow">
            <Input
              value={labelName}
              className="w-full"
              onChange={(e) => setLabelName(e.target.value)}
              placeholder="Name"
            />
          </div>

          <div className="flex gap-4">
            <Button variant="ghost" disabled={isLoading} onClick={onCancel}>
              Cancel
            </Button>
            <Button
              isLoading={isLoading}
              variant="secondary"
              onClick={onSubmit}
            >
              Save
            </Button>
          </div>
        </div>
      )}

      {data && (
        <div className="flex flex-col">
          <p>
            Copy this key and store this carefully. This will be only shown once
          </p>

          <div className="flex items-center">
            <div className="text-muted-foreground">{data.token}</div>
            <Button
              variant="link"
              size="xs"
              onClick={() => {
                copy(data.token);
              }}
            >
              <RiClipboardLine size={16} className="text-muted-foreground" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
