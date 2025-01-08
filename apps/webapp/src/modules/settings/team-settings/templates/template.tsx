import { Button } from '@tegonhq/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tegonhq/ui/components/dropdown-menu';
import { DeleteLine, EditLine, MoreLine } from '@tegonhq/ui/icons';
import * as React from 'react';

import type { TemplateType } from 'common/types';

import { useDeleteTemplateMutation } from 'services/templates';

import { DeleteTemplateAlert } from './delete-template-alert';
import { UpdateTemplate } from './update-template';

interface TemplateProps {
  template: TemplateType;
}

export function Template({ template }: TemplateProps) {
  const [deleteAlert, setDeleteAlert] = React.useState(false);
  const [updateTemplate, setUpdateTemplate] = React.useState(false);

  const { mutate: deleteTemplateAPI } = useDeleteTemplateMutation({});

  if (updateTemplate) {
    return (
      <div className="my-2">
        <UpdateTemplate
          onClose={() => setUpdateTemplate(false)}
          template={template}
        />
      </div>
    );
  }

  return (
    <div className="group flex justify-between mb-2 bg-background-3 rounded-lg p-2 px-4">
      <div className="flex items-center justify-center gap-3">
        <div>{template.name}</div>
      </div>

      <div className="items-center justify-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="flex items-center">
            <Button variant="ghost" size="sm" className="flex items-center">
              <MoreLine size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setUpdateTemplate(true);
              }}
            >
              <div className="flex items-center gap-1">
                <EditLine size={16} /> Edit
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteAlert(true)}>
              <div className="flex items-center gap-1">
                <DeleteLine size={16} /> Delete
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteTemplateAlert
        open={deleteAlert}
        setOpen={setDeleteAlert}
        deleteTemplate={() => deleteTemplateAPI({ templateId: template.id })}
      />
    </div>
  );
}
