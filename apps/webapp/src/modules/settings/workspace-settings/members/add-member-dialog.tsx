import { zodResolver } from '@hookform/resolvers/zod';
import { RoleEnum } from '@tegonhq/types';
import { Button } from '@tegonhq/ui/components/button';
import {
  DialogContent,
  Dialog,
  DialogHeader,
  DialogTitle,
} from '@tegonhq/ui/components/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@tegonhq/ui/components/form';
import { MultiSelect } from '@tegonhq/ui/components/multi-select';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@tegonhq/ui/components/select';
import { Textarea } from '@tegonhq/ui/components/textarea';
import { useToast } from '@tegonhq/ui/components/use-toast';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { capitalizeFirstLetter } from 'common/lib/common';
import type { TeamType } from 'common/types';

import { useInviteUsersMutation } from 'services/workspace';

import { useContextStore } from 'store/global-context-provider';

interface AddMemberDialogProps {
  setDialogOpen: (value: boolean) => void;
}

const AddMemberDialogSchema = z.object({
  emailIds: z.string(),
  teamIds: z
    .array(z.string())
    .min(1, { message: 'At least one team should be selected' }),
  role: z.string(), // Ensure it's cast as a tuple of RoleEnum values
});

export function AddMemberDialog({ setDialogOpen }: AddMemberDialogProps) {
  const { toast } = useToast();
  const { teamsStore } = useContextStore();
  const form = useForm<z.infer<typeof AddMemberDialogSchema>>({
    resolver: zodResolver(AddMemberDialogSchema),
    defaultValues: {
      emailIds: '',
      role: RoleEnum.USER,
      teamIds: [],
    },
  });

  const onClose = () => {
    setDialogOpen(false);
  };

  const { mutate: inviteUsers, isLoading } = useInviteUsersMutation({
    onSuccess: () => {
      toast({
        title: 'Invites sent',
        description: 'Invitations are sent to the emails',
      });
      onClose();
    },
    onError: (e) => {
      toast({
        title: 'Invites failed',
        description: `Try again after sometime: ${e}`,
      });
    },
  });

  const onSubmit = ({
    emailIds,
    role,
    teamIds,
  }: {
    emailIds: string;
    role: RoleEnum;
    teamIds: string[];
  }) => {
    inviteUsers({
      teamIds,
      emailIds,
      role,
    });
  };

  return (
    <Dialog open onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader className="pb-0">
          <DialogTitle className="font-normal flex flex-col gap-1">
            <div className="flex gap-1 items-center">Add member</div>
            <div className="text-muted-foreground text-left text-base leading-5 max-w-[300px]">
              Invite member to the workspace
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 items-center w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-2"
            >
              <FormField
                control={form.control}
                name="emailIds"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Emails</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="focus-visible:ring-0 bg-grayAlpha-100 w-full min-h-[60px]"
                        placeholder="elon@tesla.com, sam@tesla.com"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="my-3">
                    <FormLabel>Invite as </FormLabel>

                    <FormControl>
                      <Select
                        onValueChange={(value: string) => {
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="flex gap-1 items-center">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {[RoleEnum.USER, RoleEnum.ADMIN].map((role) => (
                              <SelectItem key={role} value={role}>
                                {capitalizeFirstLetter(role)}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teamIds"
                render={({ field }) => (
                  <FormItem className="my-3">
                    <FormLabel>Add to teams </FormLabel>

                    <FormControl>
                      <MultiSelect
                        placeholder="Select teams"
                        options={teamsStore.teams.map((team: TeamType) => ({
                          value: team.id,
                          label: team.name,
                        }))}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-end gap-2 justify-end w-full mt-2">
                <Button variant="ghost" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="secondary" type="submit" isLoading={isLoading}>
                  Invite
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
