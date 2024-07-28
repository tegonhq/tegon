import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@tegonhq/ui/components/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@tegonhq/ui/components/ui/accordion';
import { Dialog, DialogContent } from '@tegonhq/ui/components/ui/dialog';
import { useToast } from '@tegonhq/ui/components/ui/use-toast';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';
import { z } from 'zod';

import { SCOPES } from 'common/scopes';
import type { IssueType } from 'common/types/issue';

import { useScope } from 'hooks';

import {
  type CreateIssueParams,
  useCreateIssueMutation,
} from 'services/issues/create-issue';

import { NewIssueForm } from './new-issue-form';
import { NewIssueSchema } from './new-issues-type';

interface NewIssueProps {
  parentId?: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function NewIssue({ open, setOpen, parentId }: NewIssueProps) {
  useScope(SCOPES.NewIssue);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof NewIssueSchema>>({
    resolver: zodResolver(NewIssueSchema),
    defaultValues: { issues: [{ parentId }] },
  });

  const { mutate: createIssue, isLoading } = useCreateIssueMutation({
    onSuccess: (data: IssueType) => {
      form.reset();
      toast({
        title: 'Issue Created',
        description: (
          <div className="flex flex-col gap-1">
            <div>
              {data.number} - {data.title}
            </div>
          </div>
        ),
      });
    },
  });

  const { fields } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'issues', // unique name for your Field Array
  });

  const onClose = () => {
    setOpen(false);
  };

  const onSubmit = (values: { issues: CreateIssueParams[] }) => {
    const issue = values.issues[0];

    createIssue({ ...issue, parentId } as CreateIssueParams);
    onClose();
  };

  // Shortcuts
  useHotkeys(`${Key.Meta}+${Key.Enter}`, () => form.handleSubmit(onSubmit)(), [
    SCOPES.NewIssue,
  ]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          closeIcon={false}
          className="sm:max-w-[600px] min-w-[700px] gap-2"
        >
          <Form {...form}>
            <form
              className="flex flex-col overflow-hidden h-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <Accordion
                type="single"
                collapsible={false}
                value={fields[0].id}
                className="flex flex-col overflow-hidden h-full"
              >
                {fields.map((field, index) => {
                  return (
                    <AccordionItem
                      value={field.id}
                      key={field.id}
                      className="flex flex-col overflow-hidden h-full"
                    >
                      <AccordionTrigger></AccordionTrigger>
                      <AccordionContent className="flex flex-col h-full overflow-hidden">
                        <NewIssueForm
                          key={field.id}
                          isSubIssue={index > 0}
                          parentId={index === 0 && parentId}
                          form={form}
                          index={index}
                          isLoading={isLoading}
                          onClose={onClose}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
