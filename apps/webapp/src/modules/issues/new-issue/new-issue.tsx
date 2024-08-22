import { zodResolver } from '@hookform/resolvers/zod';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@tegonhq/ui/components/accordion';
import { Dialog, DialogContent } from '@tegonhq/ui/components/dialog';
import { Form } from '@tegonhq/ui/components/form';
import { Separator } from '@tegonhq/ui/components/separator';
import { useToast } from '@tegonhq/ui/components/use-toast';
import { cn } from '@tegonhq/ui/lib/utils';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';
import { z } from 'zod';

import { SCOPES } from 'common/scopes';
import type { IssueType } from 'common/types';

import {
  type CreateIssueParams,
  useCreateIssueMutation,
} from 'services/issues';

import { IssueCollapseView } from './issue-collapse-view';
import { NewIssueForm } from './new-issue-form';
import { NewIssueSchema } from './new-issues-type';

interface NewIssueProps {
  parentId?: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function NewIssue({ open, setOpen, parentId }: NewIssueProps) {
  const { toast } = useToast();

  // The form has a array of issues where first issue is the parent and the later sub issues
  const form = useForm<z.infer<typeof NewIssueSchema>>({
    resolver: zodResolver(NewIssueSchema),
    defaultValues: {
      issues: [{ parentId, title: 'New Issue' }],
    },
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
      onClose();
    },
    onError: (e) => {
      toast({
        title: 'Issue Creation error',
        description: <div className="flex flex-col gap-1">{e}</div>,
      });
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'issues', // unique name for your Field Array
  });

  const [collapseId, setCollapseId] = React.useState(fields[0].id);

  const onClose = () => {
    setOpen(false);
  };

  const onSubmit = (values: { issues: CreateIssueParams[] }) => {
    const issues = [...values.issues];
    const parentIssue = issues.shift();

    createIssue({
      ...parentIssue,
      parentId,
      subIssues: issues,
    } as CreateIssueParams);
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
              className="new-issue-form flex flex-col overflow-hidden h-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <Accordion
                type="single"
                collapsible={false}
                onValueChange={(value) => setCollapseId(value)}
                value={collapseId}
                className="flex flex-col overflow-hidden h-full"
              >
                {fields.map((field, index) => {
                  const collapsed = field.id !== collapseId;

                  return (
                    <AccordionItem
                      value={field.id}
                      key={field.id}
                      className={cn(
                        'flex flex-col overflow-hidden h-full',
                        collapsed && 'shrink-0',
                      )}
                    >
                      <AccordionTrigger className={cn()}>
                        {collapsed && (
                          <div className="flex flex-col w-full">
                            <Separator />
                            <IssueCollapseView
                              index={index}
                              form={form}
                              isSubIssue={index > 0}
                              // Sub issue controllers
                              subIssueOperations={{
                                append,
                                remove,
                              }}
                            />
                          </div>
                        )}
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col h-full overflow-hidden">
                        <Separator />
                        <NewIssueForm
                          key={field.id}
                          isSubIssue={index > 0}
                          parentId={index === 0 && parentId}
                          form={form}
                          index={index}
                          isLoading={isLoading}
                          onClose={onClose}
                          // Sub issue controllers
                          subIssueOperations={{
                            append,
                            remove,
                          }}
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
