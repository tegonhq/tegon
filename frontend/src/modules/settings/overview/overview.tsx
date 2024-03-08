/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { zodResolver } from '@hookform/resolvers/zod';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from 'components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Separator } from 'components/ui/separator';
import { useToast } from 'components/ui/use-toast';
import { useWorkspaceStore } from 'hooks/workspace';

import { useUpdateWorkspaceMutation } from 'services/workspace/update-workspace';

import { OverviewSchema } from './overview.interface';

export const Overview = observer(() => {
  const workspaceStore = useWorkspaceStore();
  const { toast } = useToast();
  const { mutate: updateWorkspace } = useUpdateWorkspaceMutation({
    onSuccess: () => {
      toast({
        title: 'Saved!',
        description: 'Your workspace information has been updated',
      });
    },
  });

  const form = useForm<z.infer<typeof OverviewSchema>>({
    resolver: zodResolver(OverviewSchema),
    defaultValues: {
      name: workspaceStore.workspace.name,
    },
  });

  async function onSubmit(values: z.infer<typeof OverviewSchema>) {
    updateWorkspace({
      workspaceId: workspaceStore.workspace.id,
      name: values.name,
    });
  }

  return (
    <div>
      <div className="flex flex-col">
        <h2 className="text-2xl"> Workspace </h2>
        <p className="text-sm text-muted-foreground">
          Manage your workspace settings
        </p>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col">
        <h3 className="text-base mb-2"> General </h3>
      </div>

      <div className="py-4">
        <div className="max-w-[250px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace name</FormLabel>
                    <FormControl>
                      <Input placeholder="Tesla" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" isLoading={form.formState.isSubmitting}>
                Update
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="mt-4">
        <h3 className="text-base mb-2"> Delete workspace </h3>

        <p className="mt-2 text-muted-foreground text-sm">
          If you want to permanently delete this workspace and all of its data,
          including but not limited to users, issues, and comments, you can do
          so below.
        </p>

        <Button className="mt-4" variant="destructive">
          Delete this workspace
        </Button>
      </div>
    </div>
  );
});
