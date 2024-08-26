import type { FieldConfig, FormSchema } from './components/types';

import { Button } from '@tegonhq/ui/components/button';
import { Form } from '@tegonhq/ui/components/form';
import { useParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

import type { ActionType } from 'common/types';

import { useUpdateActionInputsMutation } from 'services/action';

import { useContextStore } from 'store/global-context-provider';

import { FormField } from './components/form-field';

const getData = (action: ActionType) => {
  try {
    return JSON.parse(action.data);
  } catch (e) {
    return {};
  }
};

export const Configuration = ({ schema }: { schema: FormSchema }) => {
  const { actionSlug } = useParams();
  const { actionsStore } = useContextStore();

  const action = actionsStore.getAction(actionSlug);
  const inputs = getData(action)?.inputs;

  const { mutate: updateActionInputs } = useUpdateActionInputsMutation({});
  // const zodSchema = generateZodSchema(schema);
  const form = useForm({
    defaultValues: inputs,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    updateActionInputs({
      inputs: data,
      slug: actionSlug as string,
    });
  };

  return (
    <div className="flex flex-col gap-2 bg-background-3 rounded p-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {Object.entries(schema.properties).map(([name, config]) => (
            <div key={name}>
              <FormField
                name={name}
                config={config as FieldConfig}
                control={form.control}
              />
            </div>
          ))}
          <div className="flex justify-end mt-4">
            <Button type="submit" variant="secondary" size="lg">
              Save configuration
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
