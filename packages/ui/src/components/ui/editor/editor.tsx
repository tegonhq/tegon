'use client';
import type { Editor as EditorT, Extension } from '@tiptap/core';

import {
  EditorInstance,
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorContent,
  useEditor,
} from 'novel';
import {
  ImageResizer,
  UpdatedImage,
  handleCommandNavigation,
} from 'novel/extensions';
import { handleImagePaste } from 'novel/plugins';
import * as React from 'react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { defaultExtensions, getPlaceholder } from './editor-extensions';
import GenerativeMenuSwitch from './generative/generative-menu-switch';
import {
  NodeSelector,
  TextButtons,
  ColorSelector,
  LinkSelector,
} from './selectors';
import { slashCommand, suggestionItems } from './slash-command';
import { uploadFn } from './utils';
import { cn } from '../../../lib/utils';
import { CommandEmpty, CommandList } from '../command';
import { Separator } from '../separator';

interface EditorProps {
  value?: string;
  onChange?: (value: string, valueString?: string) => void;
  autoFocus?: boolean;
  className?: string;
  editorClassName?: string;
  placeholder?: string | Extension;
  editable?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: () => void;
  onCreate?: (editor: EditorT) => void;
}

export const EditorChild = ({
  autoFocus,
  value,
}: {
  autoFocus: boolean;
  value: string;
}) => {
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);
  const { editor } = useEditor();

  React.useEffect(() => {
    if (autoFocus) {
      editor.commands.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  React.useEffect(() => {
    if (value === undefined || value === '') {
      editor.commands.clearContent();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <>
      <EditorCommand
        className={cn(
          'font-sans w-52 rounded-md bg-background-2 backdrop-blur-md px-1 shadow-2 transition-all flex flex-col',
        )}
      >
        <CommandList className="overflow-auto">
          <CommandEmpty className="px-2 text-muted-foreground">
            No results
          </CommandEmpty>
          {suggestionItems.map((item) => (
            <EditorCommandItem
              value={item.title}
              onCommand={(val) => item.command(val)}
              className={`flex w-full items-center space-x-2 my-2 rounded px-2 py-1 text-left hover:bg-accent aria-selected:bg-accent hover:text-accent-foreground aria-selected:text-accent-foreground`}
              key={item.title}
            >
              <div className="flex h-4 w-4 items-center justify-center">
                {item.icon}
              </div>
              <div>
                <p className="font-medium">{item.title}</p>
              </div>
            </EditorCommandItem>
          ))}
        </CommandList>
      </EditorCommand>

      <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
        <Separator orientation="vertical" />
        <NodeSelector open={openNode} onOpenChange={setOpenNode} />
        <Separator orientation="vertical" />
        <LinkSelector open={openLink} onOpenChange={setOpenLink} />
        <Separator orientation="vertical" />
        <TextButtons />
        <Separator orientation="vertical" />
        <ColorSelector open={openColor} onOpenChange={setOpenColor} />
      </GenerativeMenuSwitch>
    </>
  );
};

export const Editor = ({
  value,
  onChange,
  autoFocus = false,
  className,
  editorClassName,
  placeholder,
  onFocus,
  onBlur,
  onCreate,
  onSubmit,
  editable = true,
}: EditorProps) => {
  function getInitialValue() {
    try {
      return value ? JSON.parse(value) : undefined;
    } catch (e) {
      // Do this because sometimes you will just have text
      return value;
    }
  }

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();

      onChange && onChange(JSON.stringify(json), editor.getText());
    },
    500,
  );

  const getExtensions = () => {
    const extensions = [
      ...defaultExtensions,
      slashCommand,
      UpdatedImage,
      getPlaceholder(placeholder),
    ];

    return extensions;
  };

  return (
    // TODO: Change this to the editor input
    <div onFocus={onFocus} onBlur={onBlur} className="relative">
      <EditorRoot>
        <EditorContent
          initialContent={getInitialValue()}
          extensions={getExtensions()}
          className={cn('w-full min-w-full text-base sm:rounded-lg', className)}
          onCreate={({ editor }) => {
            if (onCreate) {
              onCreate(editor);
            }

            autoFocus && editor.commands.focus();
          }}
          editorProps={{
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),

            handleDOMEvents: {
              keydown: (_view, event) => {
                if (event.keyCode === 13 && event.metaKey) {
                  onSubmit && onSubmit();
                  event.preventDefault();
                  return false;
                }
                return handleCommandNavigation(event);
              },
            },
            editable: () => editable,
            attributes: {
              class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full ${editorClassName}`,
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorChild autoFocus={autoFocus} value={value} />
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export type { EditorT };
