import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@tegonhq/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@tegonhq/ui/components/form';
import { Input } from '@tegonhq/ui/components/input';
import { Separator } from '@tegonhq/ui/components/separator';
import { useToast } from '@tegonhq/ui/components/use-toast';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { SettingSection } from 'modules/settings/setting-section';

import { useUpdateWorkspaceMutation } from 'services/workspace';

import { useContextStore } from 'store/global-context-provider';

import { OverviewSchema } from './overview.interface';

export const Overview = observer(() => {
  const { workspaceStore } = useContextStore();

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
      name: values.name,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <h2 className="text-xl"> Workspace </h2>
      </div>

      <SettingSection
        title="Profile"
        description="Manage all the settings for your organization"
      >
        <div className="max-w-[500px]">
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

              <Button
                type="submit"
                variant="secondary"
                isLoading={form.formState.isSubmitting}
              >
                Update
              </Button>
            </form>
          </Form>
        </div>
      </SettingSection>

      <Separator className="my-4" />

      <SettingSection title="Danger zone" description="proceed with caution">
        <div className="flex flex-col">
          <h3 className="text-lg"> Delete workspace </h3>

          <p className="text-muted-foreground">
            If you want to permanently delete this workspace and all of its
            data, including but not limited to users, issues, and comments, you
            can do so below.
          </p>

          <Button className="w-fit mt-2" variant="destructive">
            Delete this workspace
          </Button>
        </div>
      </SettingSection>
    </div>
  );
});
