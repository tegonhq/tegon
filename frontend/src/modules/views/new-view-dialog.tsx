/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { zodResolver } from '@hookform/resolvers/zod';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { ViewType } from 'common/types/view';

import { Button } from 'components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/form';
import { Input } from 'components/ui/input';
import { useToast } from 'components/ui/use-toast';
import { useCurrentTeam } from 'hooks/teams';

import { useCreateViewMutation } from 'services/views';

import { useContextStore } from 'store/global-context-provider';
import { useCurrentWorkspace } from 'hooks/workspace';

export const NewViewSchema = z.object({
  name: z.string().min(6),
  description: z.string().min(6),
});

interface NewViewDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const NewViewDialog = observer(
  ({ open, setOpen }: NewViewDialogProps) => {
    const { toast } = useToast();
    const { applicationStore } = useContextStore();
    const workspace = useCurrentWorkspace();
    const team = useCurrentTeam();

    const {
      push,
      query: { workspaceSlug },
    } = useRouter();

    const filters = applicationStore.filters;

    const form = useForm<z.infer<typeof NewViewSchema>>({
      resolver: zodResolver(NewViewSchema),
      defaultValues: {
        name: '',
        description: '',
      },
    });

    const { mutate: createView, isLoading } = useCreateViewMutation({
      onSuccess: (data: ViewType) => {
        toast({
          title: `Your view was successfully created`,
        });

        setOpen(false);
        push(`/${workspaceSlug}/team/${team.identifier}/views/${data.id}`);
      },
    });

    const onSave = ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => {
      createView({
        workspaceId: workspace.id,
        filters,
        teamId: team.id,
        name,
        description,
      });
    };

    return (
      <Dialog
        open={!!open}
        onOpenChange={(open) => {
          if (!open) {
            setOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[300px]" closeIcon>
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-md text-foreground font-normal">
                Save view
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSave)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel> Name </FormLabel>
                        <FormControl>
                          <Input placeholder="Name of the view" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel> Description </FormLabel>

                        <FormControl>
                          <Input
                            placeholder="Description of the view"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      disabled={isLoading}
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                      Save
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);
