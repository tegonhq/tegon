import { Editor, EditorExtensions } from '@tegonhq/ui/components/editor/index';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { useEditorSuggestionItems } from 'modules/issues/components/use-editor-suggestion-items';

import { getTiptapJSON } from 'common';
import { AiWritingExtension } from 'common/editor';
import { tegonIssueExtension } from 'common/editor/tegon-issue-extension';

import { useProject } from 'hooks/projects';
import { useEditorPasteHandler } from 'hooks/use-editor-paste-handler';

import { useUpdateProjectMutation } from 'services/projects';

import { ProjectTitle } from './project-title';
import { ProjectSubIssueSelector } from './projects-sub-issue-selector';

export const LeftSide = observer(() => {
  const project = useProject();
  const { handlePaste } = useEditorPasteHandler();
  const { mutate: updateProject } = useUpdateProjectMutation({});
  const { suggestionItems } = useEditorSuggestionItems();

  const onDescriptionChange = useDebouncedCallback((content: string) => {
    const { json: description } = getTiptapJSON(content);

    updateProject({
      description: JSON.stringify(description),
      projectId: project.id,
    });
  }, 1000);

  const onTitleChange = useDebouncedCallback((content: string) => {
    updateProject({
      name: content,
      projectId: project.id,
    });
  }, 1000);

  if (!project) {
    return null;
  }

  return (
    <ScrollArea className="grow flex h-full justify-center w-full">
      <div className="flex h-full justify-center w-full">
        <div className="grow flex flex-col gap-2 h-full max-w-[97ch]">
          <div className="py-4 flex flex-col">
            <ProjectTitle value={project.name} onChange={onTitleChange} />

            <Editor
              value={project.description}
              onChange={onDescriptionChange}
              handlePaste={handlePaste}
              extensions={[tegonIssueExtension, AiWritingExtension]}
              className="min-h-[50px] mb-8 px-6 mt-3 text-md"
            >
              <EditorExtensions suggestionItems={suggestionItems}>
                <ProjectSubIssueSelector />
              </EditorExtensions>
            </Editor>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
});
