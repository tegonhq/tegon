import type { ViewType } from '@tegonhq/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateViewMutation } from '@tegonhq/services/views';
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
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const EditViewSchema = z.object({
  name: z.string().min(6),
  description: z.string().min(6),
});

interface EditViewDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  view: ViewType;
}

export function EditViewDialog({ open, setOpen, view }: EditViewDialogProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof EditViewSchema>>({
    resolver: zodResolver(EditViewSchema),
    defaultValues: {
      name: view.name,
      description: view.description,
    },
  });

  const { mutate: updateView, isLoading } = useUpdateViewMutation({
    onSuccess: () => {
      toast({
        title: `Your view was successfully updated`,
      });
      setOpen(false);
    },
  });

  const onSubmit = (values: { name: string; description: string }) => {
    updateView({
      viewId: view.id,
      ...values,
      filters: view.filters,
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
      <DialogContent className="sm:max-w-[600px]" closeIcon={false}>
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-md text-foreground font-normal">
              Edit view
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
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
}
