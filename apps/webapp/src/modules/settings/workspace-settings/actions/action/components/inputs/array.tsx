import type { ArrayFieldConfig } from '../types';

import { Button } from '@tegonhq/ui/components/button';
import { cn } from '@tegonhq/ui/lib/utils';
import React from 'react';
import { useFieldArray, type Control } from 'react-hook-form';

import { FormField } from '../form-field';

interface ArrayProps {
  config: ArrayFieldConfig;
  control: Control;
  name: string;
}

export function Array({ control, config, name }: ArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h3>{config.title}</h3>
          {config.description && (
            <div className="text-muted-foreground">{config.description}</div>
          )}
        </div>
        <Button type="button" variant="secondary" onClick={() => append({})}>
          Add
        </Button>
      </div>
      {fields.map((item, index: number) => {
        return (
          <div key={item.id} className="flex gap-2 w-full items-end">
            {Object.entries(config.items.properties).map(
              ([subName, subConfig]) => (
                <div
                  key={subName}
                  className={cn(
                    index > 0 && 'border-t border-border',
                    'w-full',
                  )}
                >
                  <FormField
                    name={`${name}.${index}.${subName}`}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    config={subConfig as any}
                    control={control}
                  />
                </div>
              ),
            )}
            <div>
              <Button
                variant="link"
                className="mb-4"
                onClick={() => {
                  remove(index);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
