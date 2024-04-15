/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

import { useUpdateLinkedIssueMutation } from 'services/linked-issues';

export const URLSchema = z.object({
  url: z.string().url(),
  title: z.string(),
});

interface EditLinkProps {
  onClose: () => void;
  url: string;
  title: string;
  linkedIssueId: string;
}

interface FormValues {
  url: string;
  title: string;
}

export function EditLink({
  onClose,
  url,
  title,
  linkedIssueId,
}: EditLinkProps) {
  const form = useForm<z.infer<typeof URLSchema>>({
    resolver: zodResolver(URLSchema),
    defaultValues: {
      url,
      title,
    },
  });
  const { mutate: updateLinkedIssue } = useUpdateLinkedIssueMutation({});

  const onSubmit = (values: FormValues) => {
    updateLinkedIssue({ ...values, linkedIssueId });
    onClose();
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      open
    >
      <DialogContent className="sm:max-w-[600px]" closeIcon={false}>
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-md text-foreground font-normal">
              Edit link
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
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/tegonhq/tegon/issues/1"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Issue/PR/Link title" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">Update</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
