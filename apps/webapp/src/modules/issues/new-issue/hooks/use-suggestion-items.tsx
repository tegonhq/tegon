import type { Editor, Range } from '@tiptap/core';
import type { UseFieldArrayReturn } from 'react-hook-form';

import { suggestionItems } from '@tegonhq/ui/components/ui/editor/slash-command';
import { ListEdit, SubIssue } from '@tegonhq/ui/icons';
import React from 'react';

import { useCurrentWorkspace } from 'hooks/workspace';

import { useSubIssueGenerationMutation } from 'services/issues';

export const useSuggestionItems = (
  subIssueOperations: Partial<UseFieldArrayReturn>,
) => {
  const workspace = useCurrentWorkspace();
  const { mutate: generateSubIssues, isLoading } =
    useSubIssueGenerationMutation({
      onSuccess: (data: string[]) => {
        if (data && data.length > 0) {
          data.forEach((issueTitle: string) => {
            subIssueOperations.append({
              title: issueTitle,
              description: JSON.stringify({
                json: {
                  type: 'doc',
                  content: [
                    {
                      type: 'aiWritingExtension',
                      attrs: {
                        content: issueTitle,
                      },
                    },
                  ],
                },
              }),
            });
          });
        }
      },
    });

  const appendedSuggestionItems = React.useMemo(() => {
    return [
      {
        title: 'Break into sub-issues',
        description: 'Break into sub issues',
        searchTerms: ['sub-issues', 'issues'],
        icon: <SubIssue size={18} className="text-purple-500" />,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          const description = editor.getText();
          if (description) {
            generateSubIssues({ description, workspaceId: workspace.id });
            editor.chain().focus().deleteRange(range).run();
          }
        },
      },
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

  return { suggestionItems: appendedSuggestionItems, isLoading };
};
