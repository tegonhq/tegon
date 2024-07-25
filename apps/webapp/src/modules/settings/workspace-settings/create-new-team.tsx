import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@tegonhq/ui/components/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@tegonhq/ui/components/form';
import { Input } from '@tegonhq/ui/components/input';
import { useToast } from '@tegonhq/ui/components/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { TeamType } from 'common/types/team';

import { useCurrentWorkspace } from 'hooks/workspace';

import { useCreateTeamMutation } from 'services/team';

import { SettingSection } from '../setting-section';

export const CreateNewTeamSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Team name must be atleast 2 characters',
    })
    .max(50),
  identifier: z.string().min(3).max(3),
});

export function CreateNewTeam() {
  const form = useForm<z.infer<typeof CreateNewTeamSchema>>({
    resolver: zodResolver(CreateNewTeamSchema),
    defaultValues: {
      name: '',
      identifier: '',
    },
  });
  const { toast } = useToast();

  const workspace = useCurrentWorkspace();
  const { mutate: createTeam } = useCreateTeamMutation({
    onSuccess: (data: TeamType) => {
      toast({
        title: 'Created!',
        description: `New team ${data.name} is created`,
      });
      form.reset();
    },
  });

  const onSubmit = (values: { name: string; identifier: string }) => {
    createTeam({ ...values, workspaceId: workspace.id });
  };

  return (
    <SettingSection
      title="Create a new team"
      description=" Create a new team to manage seperate workflows"
    >
      <div className="max-w-[400px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Engineering" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team identifier</FormLabel>
                  <FormDescription>
                    This is used as the identifier (e.g ENG-123) for all issues
                    of the team.
                  </FormDescription>

                  <FormControl>
                    <Input placeholder="e.g. ENG" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end items-center">
              <Button
                type="submit"
                variant="secondary"
                isLoading={form.formState.isSubmitting}
              >
                Create
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </SettingSection>
  );
}
