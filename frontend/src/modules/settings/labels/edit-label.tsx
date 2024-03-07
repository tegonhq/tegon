/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { LabelType } from 'common/types/label';

import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';

import { useUpdateLabelMutation } from 'services/labels/update-label';

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
    <div className="border border-gray-100 dark:border-gray-800 group flex justify-between mb-2 text-sm rounded-md bg-gray-100/80 dark:bg-gray-800 p-2 px-4">
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
