/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { generateHexColor } from 'common/color-utils';
import { useCurrentWorkspace } from 'hooks/use-current-workspace';

import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';

import { useCreateLabelMutation } from 'services/labels/create-label';

interface NewLabelProps {
  onCancel: () => void;
}

export function NewLabel({ onCancel }: NewLabelProps) {
  const [labelName, setLabelName] = React.useState('');
  const workspace = useCurrentWorkspace();
  const color = React.useMemo(() => generateHexColor(), []);
  const { mutate: createLabel, isLoading } = useCreateLabelMutation({
    onSuccess: () => {
      onCancel();
    },
  });

  const onSubmit = async () => {
    createLabel({
      name: labelName,
      workspaceId: workspace.id,
      color,
    });
  };

  return (
    <div className="border border-slate-100 dark:border-slate-800 group flex justify-between mb-2 text-sm rounded-md bg-slate-100/80 dark:bg-slate-900 p-2 px-4">
      <div className="flex items-center justify-center gap-3 w-full">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
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
