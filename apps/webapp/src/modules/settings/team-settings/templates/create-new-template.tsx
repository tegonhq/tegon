import { TemplateCategoryEnum } from '@tegonhq/types';
import { Input } from '@tegonhq/ui/components/input';
import { Separator } from '@tegonhq/ui/components/separator';
import { useToast } from '@tegonhq/ui/components/use-toast';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { NewIssue } from 'modules/issues/new-issue';

import type { CreateIssueParams } from 'services/issues';
import { useCreateTemplateMutation } from 'services/templates';

interface CreateNewTemplateProps {
  onClose: () => void;
}

export const CreateNewTemplate = observer(
  ({ onClose }: CreateNewTemplateProps) => {
    const [name, setName] = React.useState('');
    const { toast } = useToast();

    const { mutate: createTemplate, isLoading } = useCreateTemplateMutation({});

    const onTemplateCreate = ({ teamId, ...data }: CreateIssueParams) => {
      if (!isLoading) {
        if (!name) {
          toast({
            title: 'Template save error',
            description: 'Please give the template a name',
          });
          return;
        }

        createTemplate(
          {
            name,
            category: TemplateCategoryEnum.ISSUE,
            templateData: data,
            teamId,
          },
          {
            onSuccess: (data) => {
              toast({
                title: 'Template successfully created',
                description: `${data.name} template is created`,
              });
              onClose();
            },
          },
        );
      }
    };

    return (
      <div className="flex flex-col gap-2 p-4 rounded bg-background-3">
        <div className="flex flex-col gap-0.5">
          <label> Template name </label>
          <Input
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Template name"
          />
        </div>
        <Separator className="mt-4" />
        <div className="rounded">
          <NewIssue
            createOutsideFunction={onTemplateCreate}
            onClose={onClose}
          />
        </div>
      </div>
    );
  },
);
