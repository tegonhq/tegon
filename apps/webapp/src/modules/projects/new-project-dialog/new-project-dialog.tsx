import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent } from '@tegonhq/ui/components/dialog';
import { Form } from '@tegonhq/ui/components/form';
import { useToast } from '@tegonhq/ui/components/use-toast';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';
import { z } from 'zod';

import { SCOPES } from 'common/scopes';

import { useScope } from 'hooks';

import { NewProjectSchema } from './new-project-dialog.type';

interface NewProjectProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function NewProject({ open, setOpen }: NewProjectProps) {
  useScope(SCOPES.NewProject);

  const { toast } = useToast();

  // The form has a array of issues where first issue is the parent and the later sub issues
  const form = useForm<z.infer<typeof NewProjectSchema>>({
    resolver: zodResolver(NewProjectSchema),
    defaultValues: {},
  });

  const onSubmit = () => {};

  // Shortcuts
  useHotkeys(
    [`${Key.Meta}+${Key.Enter}`, `${Key.Control}+${Key.Enter}`],
    () => form.handleSubmit(onSubmit)(),
    {
      enableOnFormTags: true,
    },
    [SCOPES.NewProject],
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          closeIcon={false}
          className="sm:max-w-[600px] min-w-[700px] gap-2"
        >
          <Form {...form}>
            <form
              className="new-issue-form flex flex-col overflow-hidden h-full"
              onSubmit={form.handleSubmit(onSubmit)}
            ></form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
