/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from 'components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from 'components/ui/form';
import { Textarea } from 'components/ui/textarea';

import { NewIssueSchema } from './new-issues-type';
import { IssueStatus } from '../components/issue-status/issue-status';
import { IssueLabel } from '../components/issue-label/issue-label';

export function NewIssue() {
  const form = useForm<z.infer<typeof NewIssueSchema>>({
    resolver: zodResolver(NewIssueSchema),
  });

  const onSubmit = () => {};

  return (
    <div className="flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="p-3 pt-0 ">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="!border-0 p-0 shadow-none text-md focus-visible:ring-0"
                      placeholder="Add description..."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <IssueStatus />
              <IssueLabel defaultLabelIds={[]} />
            </div>
          </div>

          <div className="flex items-center justify-end p-2 border-t">
            <Button type="submit">Create issue</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
