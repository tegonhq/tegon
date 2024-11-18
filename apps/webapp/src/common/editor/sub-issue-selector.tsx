import { Button } from '@tegonhq/ui/components/button';
import { useEditor } from '@tegonhq/ui/components/editor/index';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@tegonhq/ui/components/tooltip';
import { SubIssue } from '@tegonhq/ui/icons';
import React from 'react';

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function getUrlFromString(str: string) {
  if (isValidUrl(str)) {
    return str;
  }
  try {
    if (str.includes('.') && !str.includes(' ')) {
      return new URL(`https://${str}`).toString();
    }
  } catch (e) {
    return null;
  }

  return null;
}

export interface IssueContent {
  text: string;
  start: number;
  end: number;
}

interface SubIssueSelectorProps {
  subIssue?: boolean;
  onCreate: (issues: IssueContent[]) => void;
}

export const SubIssueSelector = ({
  subIssue = false,
  onCreate,
}: SubIssueSelectorProps) => {
  const { editor } = useEditor();

  const processNodes = () => {
    const selection = editor.view.state.selection;
    const textContent = [
      {
        text: editor.state.doc.textBetween(selection.from, selection.to),
        start: selection.from,
        end: selection.to,
      },
    ];

    return textContent;
  };

  const createSubIssue = () => {
    const textContent = processNodes();
    onCreate && onCreate(textContent);
  };

  return (
    <div className="flex">
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="ghost"
            onClick={createSubIssue}
            className="gap-2 rounded border-none hover:bg-accent hover:text-accent-foreground"
          >
            <SubIssue size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {subIssue ? `Create sub issue` : `Create issue`}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
