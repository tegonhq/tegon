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

export interface IssueContent {
  text: string;
  start: number;
  end: number;
}

interface SubIssueSelectorProps {
  text: string;
  onCreate: (issues: IssueContent[]) => void;
}

export const SubIssueSelector = ({ text, onCreate }: SubIssueSelectorProps) => {
  const { editor } = useEditor();

  if (!editor) {
    return null;
  }

  const createSubIssue = () => {
    const selection = editor.view.state.selection;
    let textContent;
    // Get the selection content and examine its structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fragment = (selection.content().content as any).content[0];

    // Get the resolved position and check parent nodes
    let isFullBulletList = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fragment.forEach((node: any) => {
      if (node.type.name !== 'listItem') {
        isFullBulletList = false;
      }
    });

    if (isFullBulletList) {
      const items: Array<{ text: string; start: number; end: number }> = [];
      let currentPos = selection.from;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fragment.forEach((node: any) => {
        const nodeSize = node.nodeSize;
        items.push({
          text: node.textContent,
          start: currentPos,
          end: currentPos + nodeSize,
        });
        currentPos += nodeSize;
      });
      textContent = items;
    } else {
      textContent = [
        {
          text: editor.state.doc.textBetween(selection.from, selection.to),
          start: selection.from,
          end: selection.to,
        },
      ];
    }

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
        <TooltipContent side="bottom">{text}</TooltipContent>
      </Tooltip>
    </div>
  );
};
