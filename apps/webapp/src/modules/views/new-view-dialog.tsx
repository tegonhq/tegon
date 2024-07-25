import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@tegonhq/ui/components/button';
import {
  Dialog,
  DialogContent,
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
import { Input } from '@tegonhq/ui/components/input';
import { useToast } from '@tegonhq/ui/components/use-toast';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { ViewType } from 'common/types/view';

import { useCurrentTeam } from 'hooks/teams';
import { useCurrentWorkspace } from 'hooks/workspace';

import { useCreateViewMutation } from 'services/views';

import { useContextStore } from 'store/global-context-provider';

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
                      variant="ghost"
                      disabled={isLoading}
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="secondary"
                      isLoading={isLoading}
                    >
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
