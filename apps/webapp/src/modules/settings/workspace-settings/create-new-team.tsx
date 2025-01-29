import { zodResolver } from '@hookform/resolvers/zod';
import { Team, TeamType as TeamTypeEnum } from '@tegonhq/types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@tegonhq/ui/components/select';
import { useToast } from '@tegonhq/ui/components/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
  teamType: z.enum(['engineering', 'support'], {
    errorMap: () => ({
      message: 'Team type must be either engineering or support',
    }),
  }),
});

export function CreateNewTeam() {
  const form = useForm<z.infer<typeof CreateNewTeamSchema>>({
    resolver: zodResolver(CreateNewTeamSchema),
    defaultValues: {
      name: '',
      identifier: '',
      teamType: 'engineering',
    },
  });
  const { toast } = useToast();

  const { mutate: createTeam } = useCreateTeamMutation({
    onSuccess: (data: Team) => {
      toast({
        title: 'Created!',
        description: `New team ${data.name} is created`,
      });
      form.reset();
    },
  });

  const onSubmit = ({
    name,
    identifier,
    teamType,
  }: {
    name: string;
    identifier: string;
    teamType: TeamTypeEnum;
  }) => {
    createTeam({ name, identifier, preferences: { teamType } });
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
              name="teamType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team type</FormLabel>
                  <FormDescription>
                    Select the type of team - Engineering teams handle technical
                    projects and development, while Support teams manage
                    customer inquiries and assistance. This cannot be changed
                    after team creation.
                  </FormDescription>

                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                      </SelectContent>
                    </Select>
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
