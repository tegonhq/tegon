import type { EditorT } from '@tegonhq/ui/components/editor/index';
import { useContextStore } from 'store/global-context-provider';

// Updates the height of a <textarea> when the value changes.
export const useEditorPasteHandler = () => {
  const { issuesStore, teamsStore } = useContextStore();

  const handlePaste = (editor: EditorT, event: ClipboardEvent) => {
    const pastedText = event.clipboardData.getData('text/plain');
    const regex = /https?:\/\/app\.tegon\.ai\/\w+\/issue\/([A-Z]+)-(\d+)/;
    const isTegonIssue = regex.test(pastedText);
    const parts = regex.exec(pastedText);
    if (isTegonIssue && parts) {
      const teamIdentifier = parts[1]; // 'ENG' in this case
      const issueId = parts[2]; // '11' in this case
      const team = teamsStore.getTeamWithIdentifier(teamIdentifier);
      const issue = team
        ? issuesStore.getIssueByNumber(`${teamIdentifier}-${issueId}`, team.id)
        : undefined;

      if (issue) {
        editor
          .chain()
          .insertContentAt(editor.view.state.selection.from, [
            {
              type: 'tegonIssueExtension',
              attrs: {
                url: pastedText,
              },
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: '\n',
                },
              ],
            },
          ])
          .exitCode()
          .focus()
          .run();

        return true;
      }
    }

    return false;
  };

  return { handlePaste };
};
