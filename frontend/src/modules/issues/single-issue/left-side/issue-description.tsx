/** Copyright (c) 2024, Tegon, all rights reserved. **/

'use client';
import { Inter } from 'next/font/google';
import {
  EditorInstance,
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  EditorBubble,
} from 'novel';
import { ImageResizer, handleCommandNavigation } from 'novel/extensions';
import * as React from 'react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { cn } from 'common/lib/utils';

import { Separator } from 'components/ui/separator';

import { defaultExtensions } from './editor-extensions';
import {
  NodeSelector,
  TextButtons,
  ColorSelector,
  LinkSelector,
} from './selectors';
import { slashCommand, suggestionItems } from './slash-command';

// Inter as default font
export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

interface IssueDescriptionProps {
  value?: string;
  onChange?: (value: string) => void;
}

const extensions = [...defaultExtensions, slashCommand];

export const IssueDescription = ({
  value,
  onChange,
}: IssueDescriptionProps) => {
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();

      onChange && onChange(JSON.stringify(json));
    },
    500,
  );

  return (
    <div className="relative w-full max-w-screen-lg">
      <EditorRoot>
        <EditorContent
          initialContent={value ? JSON.parse(value) : undefined}
          extensions={extensions}
          className="relative min-h-[50px] w-full max-w-screen-lg mb-[40px] text-base text-slate-600 dark:text-slate-400 sm:rounded-lg"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            attributes: {
              class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand
            className={cn(
              'z-50 h-auto font-sans max-h-[330px] w-72 overflow-y-auto rounded-md border border-muted bg-background backdrop-blur-md dark:bg-slate-700/20 px-1 py-2 shadow-md transition-all',
              fontSans.variable,
            )}
          >
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command(val)}
                className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-xs hover:bg-accent aria-selected:bg-accent `}
                key={item.title}
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-md border border-muted">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommand>

          <EditorBubble
            tippyOptions={{
              placement: 'top',
            }}
            className="flex w-fit items-center max-w-[90vw] overflow-hidden rounded border bg-background shadow-xl"
          >
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />
            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </EditorBubble>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};
