'use client';

import { useCompletion } from 'ai/react';
import { useEditor } from 'novel';
import { addAIHighlight } from 'novel/extensions';
import { useState } from 'react';
import Markdown from 'react-markdown';

import { Command, CommandInput } from '@tegonhq/ui/components/command';
import { Loader } from '@tegonhq/ui/components/loader';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { AI } from '@tegonhq/ui/icons';

import AICompletionCommands from './ai-completion-command';
import AISelectorCommands from './ai-selector-commands';

// TODO: I think it makes more sense to create a custom Tiptap extension for this functionality https://tiptap.dev/docs/editor/ai/introduction

interface AISelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AISelector({ onOpenChange }: AISelectorProps) {
  const { editor } = useEditor();
  const [inputValue, setInputValue] = useState('');

  const { completion, complete, isLoading } = useCompletion({
    // id: "novel",
    api: '/api/generate',
    onError: (e) => {
      console.log(e);
    },
  });

  const hasCompletion = completion.length > 0;

  return (
    <Command className="w-[280px] bg-background-2">
      {hasCompletion && (
        <div className="flex max-h-[400px]">
          <ScrollArea>
            <div className="prose p-2 px-4 prose-sm">
              <Markdown>{completion}</Markdown>
            </div>
          </ScrollArea>
        </div>
      )}

      {isLoading && (
        <div className="flex h-12 w-full items-center px-4 text-sm font-medium text-purple-500">
          <AI className="mr-2 h-4 w-4 shrink-0  " />
          AI is thinking
          <div className="ml-2 mt-1">
            <Loader />
          </div>
        </div>
      )}
      {!isLoading && (
        <>
          <div className="relative">
            <CommandInput
              value={inputValue}
              onValueChange={setInputValue}
              autoFocus
              placeholder={
                hasCompletion
                  ? 'Tell AI what to do next'
                  : 'Ask AI to edit or generate...'
              }
              onFocus={() => addAIHighlight(editor)}
            />
          </div>
          {hasCompletion ? (
            <AICompletionCommands
              onDiscard={() => {
                editor.chain().unsetHighlight().focus().run();
                onOpenChange(false);
              }}
              completion={completion}
            />
          ) : (
            <AISelectorCommands
              onSelect={(value, option) =>
                complete(value, { body: { option } })
              }
            />
          )}
        </>
      )}
    </Command>
  );
}
