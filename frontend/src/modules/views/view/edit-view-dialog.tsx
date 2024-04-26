/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { zodResolver } from '@hookform/resolvers/zod';
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
  FormMessage,
} from 'components/ui/form';
import { Input } from 'components/ui/input';
import { useToast } from 'components/ui/use-toast';

import { useUpdateViewMutation } from 'services/views';

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
