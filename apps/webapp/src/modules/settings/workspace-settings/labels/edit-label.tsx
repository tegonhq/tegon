import type { LabelType } from 'common/types';

import { useUpdateLabelMutation } from '@tegonhq/services/labels';
import { Button } from '@tegonhq/ui/components/button';
import { Input } from '@tegonhq/ui/components/input';
import * as React from 'react';

interface NewLabelProps {
  onCancel: () => void;
  label: LabelType;
}

export function EditLabel({ onCancel, label }: NewLabelProps) {
  const [labelName, setLabelName] = React.useState(label.name);

  const { mutate: updateLabel, isLoading } = useUpdateLabelMutation({
    onSuccess: () => {
      onCancel();
    },
  });

  const onSubmit = async () => {
    updateLabel({
      labelId: label.id,
      name: labelName,
    });
  };

  return (
    <div className="group flex justify-between mb-2 rounded bg-background-3 p-2 px-4">
      <div className="flex items-center justify-center gap-3 w-full">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: label.color }}
        />
        <div className="grow">
          <Input
            value={labelName}
            className="w-full"
            onChange={(e) => setLabelName(e.target.value)}
            placeholder="Label name"
          />
        </div>

        <div className="flex gap-4">
          <Button variant="outline" disabled={isLoading} onClick={onCancel}>
            Cancel
          </Button>
          <Button isLoading={isLoading} onClick={onSubmit}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
