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
import { useRouter } from 'next/router';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { SettingSection } from 'modules/settings/setting-section';

import type { TeamType } from 'common/types';

import { useCurrentTeam } from 'hooks/teams/use-current-team';

import { useUpdateTeamMutation } from 'services/team';

import { DeleteTeamButton } from './delete-team-button';
import { OverviewSchema } from './overview.interface';
import { Preferences } from './preferences';

export const Overview = observer(() => {
  const currentTeam = useCurrentTeam();
  const { toast } = useToast();
  const {
    replace,
    query: { workspaceSlug },
  } = useRouter();

  const { mutate: updateTeam } = useUpdateTeamMutation({
    onSuccess: (data: TeamType) => {
      replace(`/${workspaceSlug}/settings/teams/${data.identifier}/overview`);

      toast({
        title: 'Team updated',
        description: 'Team details updated successfully',
      });
    },
  });

  const form = useForm<z.infer<typeof OverviewSchema>>({
    resolver: zodResolver(OverviewSchema),
    defaultValues: {
      name: currentTeam.name,
      identifier: currentTeam.identifier,
    },
  });

  React.useEffect(() => {
    form.setValue('name', currentTeam?.name);
    form.setValue('identifier', currentTeam?.identifier);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTeam]);

  async function onSubmit(values: z.infer<typeof OverviewSchema>) {
    updateTeam({
      ...values,
      teamId: currentTeam.id,
    });
  }

  if (!currentTeam) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <SettingSection title="Team" description=" Manage your team settings">
        <div className="max-w-[250px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team name</FormLabel>
                    <FormControl>
                      <Input placeholder="Tesla" {...field} />
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
                    <FormControl>
                      <Input placeholder="TES" {...field} />
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
      <Preferences />
      <Separator className="my-4" />

      <SettingSection title="Danger zone" description="proceed with caution">
        <div className="flex flex-col">
          <h3 className="text-lg"> Delete team </h3>

          <p className="text-muted-foreground">
            If you want to permanently delete this team and all of its data,
            including but not limited to users, issues, and comments, you can do
            so below.
          </p>

          <DeleteTeamButton />
        </div>
      </SettingSection>
    </div>
  );
});
