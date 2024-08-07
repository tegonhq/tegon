import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateLinkedIssueMutation } from '@tegonhq/services/linked-issues';
import { LinkedIssueSubType } from '@tegonhq/types';
import { Button } from '@tegonhq/ui/components/button';
import {
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

import { useCurrentTeam } from 'hooks/teams';

export const URLSchema = z.object({
  url: z.string().url(),
  title: z.optional(z.string()),
});

interface AddGithubIssueProps {
  issueId: string;
  placeholder: string;
  type: LinkedIssueSubType;
  title: string;
  description?: string;
  askTitleInForm: boolean;
  onClose: () => void;
}

export function AddLinkedIssue({
  issueId,
  onClose,
  title,
  description,
  askTitleInForm,
  type,
  placeholder,
}: AddGithubIssueProps) {
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
        onClose();
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
    <div className="p-6">
      <DialogHeader>
        <DialogTitle className="text-md text-foreground font-normal">
          {title}
        </DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>

      <div className="mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <Button variant="ghost" disabled={isLoading} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="secondary" isLoading={isLoading}>
                Add
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
