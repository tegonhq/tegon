import { Button } from '@tegonhq/ui/components/button';
import { useEditor } from '@tegonhq/ui/components/editor/index';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@tegonhq/ui/components/tooltip';
import { SubIssue } from '@tegonhq/ui/icons';

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

export const SubIssueSelector = () => {
  const { editor } = useEditor();

  if (!editor) {
    return null;
  }

  const createSubIssue = () => {
    // const selection = editor.state.selection;
    // const text = editor.state.doc.cut(selection.from, selection.to);
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
        <TooltipContent side="bottom">Create sub-issues</TooltipContent>
      </Tooltip>
    </div>
  );
};
