import { Check, ChevronDown } from 'lucide-react';
import { EditorBubbleItem, useEditor } from 'novel';
import React from 'react';

import {
  BulletListLine,
  CodingLine,
  HeadingLine,
  IssuesLine,
  NumberedListLine,
  TextLine,
} from '@tegonhq/ui/icons';

import { Button } from '../../button';
import { PopoverContent, PopoverTrigger, Popover } from '../../popover';

export interface SelectorItem {
  name: string;
  icon: React.ElementType;
  command: (editor: ReturnType<typeof useEditor>['editor']) => void;
  isActive: (editor: ReturnType<typeof useEditor>['editor']) => boolean;
}

const items: SelectorItem[] = [
  {
    name: 'Text',
    icon: TextLine,
    command: (editor) => editor.chain().focus().clearNodes().run(),
    // I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
    isActive: (editor) =>
      editor.isActive('paragraph') &&
      !editor.isActive('bulletList') &&
      !editor.isActive('orderedList'),
  },
  {
    name: 'Heading 1',
    icon: HeadingLine,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 1 }),
  },
  {
    name: 'Heading 2',
    icon: HeadingLine,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 2 }),
  },
  {
    name: 'Heading 3',
    icon: HeadingLine,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 3 }),
  },
  {
    name: 'To-do List',
    icon: IssuesLine,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleTaskList().run(),
    isActive: (editor) => editor.isActive('taskItem'),
  },
  {
    name: 'Bullet List',
    icon: BulletListLine,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleBulletList().run(),
    isActive: (editor) => editor.isActive('bulletList'),
  },
  {
    name: 'Numbered List',
    icon: NumberedListLine,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive('orderedList'),
  },
  {
    name: 'Code',
    icon: CodingLine,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive('codeBlock'),
  },
];
interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NodeSelector = ({ open, onOpenChange }: NodeSelectorProps) => {
  const { editor } = useEditor();
  if (!editor) {
    return null;
  }
  const activeItem = items.filter((item) => item.isActive(editor)).pop() ?? {
    name: 'Multiple',
  };

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild className="gap-2 focus:ring-0">
        <Button
          variant="ghost"
          className="gap-2 px-2 hover:bg-accent hover:text-accent-foreground text-base"
        >
          <span className="whitespace-nowrap">{activeItem.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={5} align="start" className="w-48 p-1">
        {items.map((item, index) => (
          <EditorBubbleItem
            key={index}
            onSelect={(editor) => {
              item.command(editor);
              onOpenChange(false);
            }}
            className="flex cursor-pointer items-center text-base justify-between rounded px-2 py-0.5 hover:bg-accent hover:text-accent-foreground "
          >
            <div className="flex items-center gap-2">
              <div className="w-4">
                {activeItem.name === item.name && <Check className="h-4 w-4" />}
              </div>
              <div className="rounded p-1">
                <item.icon className="h-5 w-5" />
              </div>
              <span>{item.name}</span>
            </div>
          </EditorBubbleItem>
        ))}
      </PopoverContent>
    </Popover>
  );
};
