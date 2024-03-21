/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LinkedIssueSubType } from 'common/types/linked-issue';

import { Button } from 'components/ui/button';
import {
  DialogDescription,
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
import { useCurrentTeam } from 'hooks/teams';

import { useCreateLinkedIssueMutation } from 'services/issues';

import { URLSchema } from './add-github-issue';
interface AddGithubPRProps {
  issueId: string;

  onClose: () => void;
}

export function AddGithubPR({ issueId, onClose }: AddGithubPRProps) {
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
    },
  );

  const onSubmit = (values: { url: string }) => {
    createLinkedIssue({
      url: values.url,
      type: LinkedIssueSubType.GithubIssue,
      issueId,
      teamId: currentTeam.id,
    });
  };

  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle className="text-md text-foreground font-normal">
          Enter URL of Github PR to link
        </DialogTitle>
        <DialogDescription>
          Copy the URL from the browser when viewing the issue
        </DialogDescription>
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
                    <Input
                      placeholder="https://github.com/tegonhq/tegon/pull/1"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" disabled={isLoading} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Add
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
