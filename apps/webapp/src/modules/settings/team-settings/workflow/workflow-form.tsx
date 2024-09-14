import type { WorkflowCategoryEnum } from '@tegonhq/types';

import { Button } from '@tegonhq/ui/components/button';
import { Input } from '@tegonhq/ui/components/input';
import * as React from 'react';

import { getWorkflowColorWithNumber } from 'common/status-color';
import type { WorkflowType } from 'common/types';
import { getWorkflowIconForCategory } from 'common/workflow-icons';

import { ColorPicker } from './color-picker';

interface WorkflowFormProps {
  onCancel: () => void;
  submit: (name: string, description: string, color: string) => void;
  isLoading: boolean;
  category: WorkflowCategoryEnum;
  workflow?: WorkflowType;
}

export function WorfklowForm({
  onCancel,
  category,
  submit,
  isLoading,
  workflow,
}: WorkflowFormProps) {
  const [workflowName, setWorkflowName] = React.useState(workflow?.name ?? '');
  const [description, setDescription] = React.useState(
    workflow?.description ?? '',
  );

  const [color, setColor] = React.useState(workflow?.color ?? '1');

  const CategoryIcon = getWorkflowIconForCategory(category);

  const onSubmit = () => {
    submit(workflowName, description, color);
  };

  return (
    <div className="group flex justify-between mb-2 bg-background-3 rounded p-2 px-4">
      <div className="flex items-center justify-center gap-3 w-full">
        <ColorPicker onChange={(color) => setColor(color)}>
          <Button variant="link" size="sm">
            <CategoryIcon
              size={20}
              className="text-muted-foreground"
              color={getWorkflowColorWithNumber(color).color}
            />
          </Button>
        </ColorPicker>
        <div className="grow flex gap-2">
          <Input
            value={workflowName}
            className="w-full"
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder="Workflow name"
          />
          <Input
            value={description}
            className="w-full"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Workflow description"
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
