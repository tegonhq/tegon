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
import { useTeams } from 'hooks/teams';

import { useCreateProjectMutation } from 'services/projects';

import { NewProjectForm } from './new-project-dialog-form';
import { NewProjectSchema } from './new-project-dialog.type';

interface NewProjectProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

interface FormValues extends z.infer<typeof NewProjectSchema> {
  name: string;
}

export function NewProjectDialog({ open, setOpen }: NewProjectProps) {
  useScope(SCOPES.NewProject);

  const teams = useTeams();

  const { toast } = useToast();

  // The form has a array of issues where first issue is the parent and the later sub issues
  const form = useForm<z.infer<typeof NewProjectSchema>>({
    resolver: zodResolver(NewProjectSchema),
    defaultValues: {
      status: 'Backlog',
      teams: [teams[0].id],
    },
  });

  const { mutate: createProject } = useCreateProjectMutation({
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Success!',
        description: 'Project created successfully',
      });
      form.reset();
      setOpen(false);
    },
  });

  const onSubmit = (values: FormValues) => {
    createProject(values);
  };

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
              className="new-issue-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <NewProjectForm
                form={form}
                onClose={() => setOpen(false)}
                isLoading={false}
              />
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
