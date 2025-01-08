import { Button } from '@tegonhq/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tegonhq/ui/components/dropdown-menu';
import * as React from 'react';

import type { TemplateType } from 'common/types';

interface TemplateProps {
  templates: TemplateType[];
  applyTemplate: (templateData: string) => void;
}

export function TemplateDropdown({ templates, applyTemplate }: TemplateProps) {
  const [template, setTemplate] = React.useState(undefined);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="flex items-center text-foreground gap-2"
        >
          {template ? template.name : 'Template'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        {templates.map((tem: TemplateType) => (
          <DropdownMenuItem
            key={tem.id}
            onSelect={() => {
              setTemplate(tem);
              applyTemplate(tem.templateData);
            }}
          >
            {tem.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
