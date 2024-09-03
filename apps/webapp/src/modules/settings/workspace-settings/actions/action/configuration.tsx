/* eslint-disable react/no-unescaped-entities */
import type { FieldConfig } from './components/types';

import { Button } from '@tegonhq/ui/components/button';
import { Form } from '@tegonhq/ui/components/form';
import { Loader } from '@tegonhq/ui/components/loader';
import { useToast } from '@tegonhq/ui/components/use-toast';
import { useParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

import type { ActionType } from 'common/types';

import {
  useGetActionInputsQuery,
  useUpdateActionInputsMutation,
} from 'services/action';

import { useContextStore } from 'store/global-context-provider';

import { FormField } from './components/form-field';

const getData = (action: ActionType) => {
  try {
    return JSON.parse(action.data);
  } catch (e) {
    return {};
  }
};

export const Configuration = () => {
  const { actionSlug } = useParams<{ actionSlug: string }>();
  const { toast } = useToast();
  const { actionsStore } = useContextStore();

  const action = actionsStore.getAction(actionSlug);
  const defaultInputs = getData(action)?.inputs;
  const { data: inputs, isLoading: configLoading } = useGetActionInputsQuery(
    actionSlug,
    action.workspaceId,
  );

  const { mutate: updateActionInputs, isLoading } =
    useUpdateActionInputsMutation({
      onSuccess: () => {
        toast({
          variant: 'success',
          title: 'Action updated!',
          description: 'Updated the action settings successfully',
        });
      },
    });
  // const zodSchema = generateZodSchema(schema);
  const form = useForm({
    defaultValues: defaultInputs,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    updateActionInputs({
      inputs: data,
      slug: actionSlug as string,
    });
  };

  if (configLoading) {
    return <Loader />;
  }

  if (!inputs) {
    return (
      <div className="flex flex-col gap-2 bg-background-3 rounded p-3">
        <h2> This action doesn't need any configuration</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 bg-background-3 rounded p-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {Object.entries(inputs.properties).map(([name, config]) => (
            <div key={name}>
              <FormField
                name={name}
                config={config as FieldConfig}
                control={form.control}
              />
            </div>
          ))}
          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              isLoading={isLoading}
            >
              Save configuration
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
