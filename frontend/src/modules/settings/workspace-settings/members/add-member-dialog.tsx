import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { TeamType } from 'common/types/team';

import { Button } from 'components/ui/button';
import {
  DialogContent,
  Dialog,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from 'components/ui/form';
import { Textarea } from 'components/ui/textarea';
import { useToast } from 'components/ui/use-toast';
import { useCurrentWorkspace } from 'hooks/workspace';

import { useInviteUsersMutation } from 'services/workspace';

import { useContextStore } from 'store/global-context-provider';

interface AddMemberDialogProps {
  setDialogOpen: (value: boolean) => void;
}

const AddMemberDialogSchema = z.object({
  emailIds: z.string(),
});

export function AddMemberDialog({ setDialogOpen }: AddMemberDialogProps) {
  const { toast } = useToast();
  const { teamsStore } = useContextStore();
  const form = useForm<z.infer<typeof AddMemberDialogSchema>>({
    resolver: zodResolver(AddMemberDialogSchema),
    defaultValues: {
      emailIds: '',
    },
  });
  const workspace = useCurrentWorkspace();

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

  const onSubmit = ({ emailIds }: { emailIds: string }) => {
    inviteUsers({
      workspaceId: workspace.id,
      teamIds: teamsStore.teams.map((team: TeamType) => team.id),
      emailIds,
    });
  };

  return (
    <Dialog open onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader className="pb-0">
          <DialogTitle className="font-normal flex flex-col gap-1">
            <div className="flex gap-1 items-center">Add member</div>
            <div className="text-muted-foreground text-base leading-5 max-w-[300px]">
              Invite member to the workspace
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 items-center w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
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
