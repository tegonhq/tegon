/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { Editor } from '@tiptap/core';

import { RiAttachmentLine } from '@remixicon/react';

import { Button } from 'components/ui/button';
import { uploadFileFn } from 'components/ui/editor/utils';

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
