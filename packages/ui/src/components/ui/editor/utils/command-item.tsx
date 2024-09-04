import type { Editor, Range } from '@tiptap/core';
import type { ComponentPropsWithoutRef } from 'react';

import { CommandEmpty, CommandItem } from '@tegonhq/ui/components/command';
import { useCurrentEditor } from '@tiptap/react';
import { useAtomValue } from 'jotai';
import { forwardRef } from 'react';
import React from 'react';

import { rangeAtom } from '../utils/atoms';

export interface EditorCommandItemProps {
  readonly onCommand: ({
    editor,
    range,
  }: {
    editor: Editor;
    range: Range;
  }) => void;
}

export const EditorCommandItem = forwardRef<
  HTMLDivElement,
  EditorCommandItemProps & ComponentPropsWithoutRef<typeof CommandItem>
>(({ children, onCommand, ...rest }, ref) => {
  const { editor } = useCurrentEditor();
  const range = useAtomValue(rangeAtom);

  if (!editor || !range) {
    return null;
  }

  return (
    <CommandItem
      ref={ref}
      {...rest}
      onSelect={() => onCommand({ editor, range })}
    >
      {children}
    </CommandItem>
  );
});

EditorCommandItem.displayName = 'EditorCommandItem';

export const EditorCommandEmpty = CommandEmpty;
