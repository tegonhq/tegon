import { Editor, EditorExtensions } from '@tegonhq/ui/components/editor/index';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { useEditorSuggestionItems } from 'modules/issues/components/use-editor-suggestion-items';

import { AiWritingExtension } from 'common/editor';
import { tegonIssueExtension } from 'common/editor/tegon-issue-extension';

import { useCycle } from 'hooks/cycles';
import { useEditorPasteHandler } from 'hooks/use-editor-paste-handler';

import { CycleTitle } from './cycle-title';
import { CycleSubIssueSelector } from './cycles-sub-issue-selector';

export const LeftSide = observer(() => {
  const cycle = useCycle();
  const { handlePaste } = useEditorPasteHandler();

  const { suggestionItems } = useEditorSuggestionItems();

  return (
    <ScrollArea className="grow flex h-full justify-center w-full">
      <div className="flex h-full justify-center w-full">
        <div className="grow flex flex-col gap-2 h-full max-w-[97ch]">
          <div className="py-4 flex flex-col">
            <CycleTitle value={cycle?.name} />

            <Editor
              value={cycle?.description}
              handlePaste={handlePaste}
              extensions={[tegonIssueExtension, AiWritingExtension]}
              className="min-h-[50px] mb-8 px-6 mt-3 text-md"
            >
              <EditorExtensions suggestionItems={suggestionItems}>
                <CycleSubIssueSelector />
              </EditorExtensions>
            </Editor>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
});
