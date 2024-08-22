import type { Editor, Range } from '@tiptap/core';

import { suggestionItems } from '@tegonhq/ui/components/editor/slash-command';
import { ListEdit } from '@tegonhq/ui/icons';
import React from 'react';

export const useEditorSuggestionItems = () => {
  const appendedSuggestionItems = React.useMemo(() => {
    return [
      {
        title: 'Continue writing',
        description: 'Continue writing the description',
        searchTerms: ['continue', 'writing'],
        icon: <ListEdit size={18} className="text-purple-500" />,

        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          const description = editor.getText();
          if (description) {
            editor
              ?.chain()
              .focus()
              .deleteRange(range)
              .createAIWritingNode(description)
              .run();
          }
        },
      },
      ...suggestionItems,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { suggestionItems: appendedSuggestionItems };
};
