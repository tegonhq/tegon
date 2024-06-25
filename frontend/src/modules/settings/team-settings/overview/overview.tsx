/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { zodResolver } from '@hookform/resolvers/zod';
import { RiClipboardLine } from '@remixicon/react';
import copy from 'copy-to-clipboard';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { SettingSection } from 'modules/settings/setting-section';

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
import { useCurrentTeam } from 'hooks/teams/use-current-team';

import { OverviewSchema } from './overview.interface';

export const Overview = observer(() => {
  const currentTeam = useCurrentTeam();
  const teamEmail = `triage+${currentTeam.id}@tegon.ai`;
  const { toast } = useToast();

  const form = useForm<z.infer<typeof OverviewSchema>>({
    resolver: zodResolver(OverviewSchema),
    defaultValues: {
      name: currentTeam.name,
      identifier: currentTeam.identifier,
    },
  });

  async function onSubmit(values: z.infer<typeof OverviewSchema>) {
    console.log(values);
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

      <SettingSection
        title="Team preferences"
        description="Manage your team preferences"
      >
        <div className="flex flex-col">
          <h3 className="text-lg"> Create by email </h3>

          <p className="text-muted-foreground">
            With the unique email created for your team, you can send or forward
            emails and we will automatically create issues in triage from them.
          </p>

          <div className="flex gap-1 max-w-[500px] mt-2">
            <Input value={teamEmail} />
            <Button
              variant="ghost"
              onClick={() => {
                copy(teamEmail);
                toast({
                  description: 'Email is copied to clipboard',
                });
              }}
            >
              <RiClipboardLine size={16} className="text-muted-foreground" />
            </Button>
          </div>
        </div>
      </SettingSection>

      <Separator className="my-4" />

      <SettingSection title="Danger zone" description="proceed with caution">
        <div className="flex flex-col">
          <h3 className="text-lg"> Delete team </h3>

          <p className="text-muted-foreground">
            If you want to permanently delete this team and all of its data,
            including but not limited to users, issues, and comments, you can do
            so below.
          </p>

          <Button className="w-fit mt-2" variant="destructive">
            Delete this team
          </Button>
        </div>
      </SettingSection>
    </div>
  );
});
