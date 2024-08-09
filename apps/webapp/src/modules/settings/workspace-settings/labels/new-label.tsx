import { useCreateLabelMutation } from 'services/labels';
import { Button } from '@tegonhq/ui/components/button';
import { Input } from '@tegonhq/ui/components/input';
import * as React from 'react';

import { generateOklchColor } from 'common/color-utils';

import { useCurrentWorkspace } from 'hooks/workspace/use-current-workspace';

interface NewLabelProps {
  onCancel: () => void;
  teamId?: string;
}

export function NewLabel({ onCancel, teamId }: NewLabelProps) {
  const [labelName, setLabelName] = React.useState('');
  const workspace = useCurrentWorkspace();
  const color = React.useMemo(() => generateOklchColor(), []);
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
      teamId,
    });
  };

  return (
    <div className="group flex justify-between mb-2 bg-background-3 rounded p-2 px-4">
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
          <Button variant="ghost" disabled={isLoading} onClick={onCancel}>
            Cancel
          </Button>
          <Button isLoading={isLoading} variant="secondary" onClick={onSubmit}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
