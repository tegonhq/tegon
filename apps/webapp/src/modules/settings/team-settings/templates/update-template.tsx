import { Input } from '@tegonhq/ui/components/input';
import { Separator } from '@tegonhq/ui/components/separator';
import { useToast } from '@tegonhq/ui/components/use-toast';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { NewIssue } from 'modules/issues/new-issue';

import type { TemplateType } from 'common/types';

import type { CreateIssueParams } from 'services/issues';
import { useUpdateTemplateMutation } from 'services/templates';

interface UpdateTemplateProps {
  onClose: () => void;
  template: TemplateType;
}

export const UpdateTemplate = observer(
  ({ onClose, template }: UpdateTemplateProps) => {
    const [name, setName] = React.useState(template.name);
    const { toast } = useToast();

    const { mutate: updateTemplate, isLoading } = useUpdateTemplateMutation({});

    const onTemplateCreate = (data: CreateIssueParams) => {
      if (!isLoading) {
        if (!name) {
          toast({
            title: 'Template save error',
            description: 'Please give the template a name',
          });
          return;
        }

        updateTemplate(
          {
            name,
            templateData: data,
            templateId: template.id,
          },
          {
            onSuccess: (data) => {
              toast({
                title: 'Template successfully updated',
                description: `${data.name} template is updated`,
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
            defaultValues={JSON.parse(template.templateData)}
            createOutsideFunction={onTemplateCreate}
            onClose={onClose}
          />
        </div>
      </div>
    );
  },
);
