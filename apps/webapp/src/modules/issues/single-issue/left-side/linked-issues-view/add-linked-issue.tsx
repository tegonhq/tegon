import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@tegonhq/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@tegonhq/ui/components/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@tegonhq/ui/components/form';
import { Input } from '@tegonhq/ui/components/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LinkedIssueSubType } from 'common/types';

import { useCurrentTeam } from 'hooks/teams';

import { useCreateLinkedIssueMutation } from 'services/linked-issues';

export const URLSchema = z.object({
  url: z.string().url(),
  title: z.optional(z.string()),
});

interface AddLinkedIssueProps {
  issueId: string;
  placeholder: string;
  type: LinkedIssueSubType;
  title: string;
  description?: string;
  askTitleInForm: boolean;
  setOpen: (value: boolean) => void;
  open: boolean;
}

export function AddLinkedIssue({
  issueId,
  setOpen,
  open,
  title,
  description,
  askTitleInForm,
  type,
  placeholder,
}: AddLinkedIssueProps) {
  const currentTeam = useCurrentTeam();
  const form = useForm<z.infer<typeof URLSchema>>({
    resolver: zodResolver(URLSchema),
    defaultValues: {
      url: '',
    },
  });
  const { mutate: createLinkedIssue, isLoading } = useCreateLinkedIssueMutation(
    {
      onError: (error: string) => {
        form.setError('url', { message: error });
      },
      onSuccess: () => {
        setOpen(false);
      },
    },
  );

  const onSubmit = (values: { url: string; title: string }) => {
    createLinkedIssue({
      url: values.url,
      title: values.title,
      type,
      issueId,
      teamId: currentTeam.id,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogContent className="sm:max-w-[600px]" closeIcon={false}>
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-md text-foreground font-normal">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
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
                        <Input placeholder={placeholder} {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {askTitleInForm && (
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Title for the above link"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

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
                    Add
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
