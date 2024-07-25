import type { Editor } from '@tiptap/core';

import { RiAttachmentLine } from '@remixicon/react';
import { Button } from '@tegonhq/ui/components/button';
import { uploadFileFn } from '@tegonhq/ui/components/editor/utils';

interface FileUploadProps {
  editor: Editor;
}

export function FileUpload({ editor }: FileUploadProps) {
  const onClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'file/*';
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        const pos = editor.view.state.selection.from;
        uploadFileFn(file, editor, pos);
      }
    };
    input.click();
  };

  return (
    <Button variant="ghost">
      <RiAttachmentLine size={16} onClick={onClick} />
    </Button>
  );
}
