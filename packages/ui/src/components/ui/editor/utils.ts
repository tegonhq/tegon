import type { Editor } from '@tiptap/core';

import { type ImageUploadOptions } from 'novel/plugins';

const onUploadFile = async (file: File) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const workspaceId = (window as any).workspaceId;
  const formData = new FormData();

  formData.append('files', file);
  const response = await fetch(
    `/api/v1/attachment/upload?workspaceId=${workspaceId}`,
    {
      method: 'POST',
      body: formData,
    },
  );

  const responseJSON = await response.json();

  // This should return a src of the uploaded image
  return responseJSON[0];
};

export const createImageUpload =
  ({ validateFn, onUpload }: ImageUploadOptions): UploadFileFn =>
  (file, editor, pos) => {
    // check if the file is an image
    const validated = validateFn?.(file) as unknown as boolean;
    if (!validated) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    onUpload(file).then((response: any) => {
      editor
        .chain()
        .insertContentAt(pos, [
          {
            type: 'imageExtension',
            attrs: {
              src: response.publicURL,
              alt: response.originalName,
              openViewer: false,
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
    });
  };

export const uploadFn = createImageUpload({
  onUpload: onUploadFile,
  validateFn: () => {
    return true;
  },
});

export const handlePaste = (
  editor: Editor,
  event: ClipboardEvent,
  uploadFn: UploadFileFn,
) => {
  if (event.clipboardData?.files.length) {
    return handleImagePaste(editor, event, uploadFn);
  }

  if (event.clipboardData.getData('text/plain')) {
    const clipboardText = event.clipboardData.getData('text/plain');
    // Convert newlines to line breaks
    const transformedText = clipboardText.replace(/\n/g, '<br>');

    // Manually insert the transformed text
    editor.commands.insertContent(transformedText);

    // Prevent the default paste action
    event.preventDefault();

    return true;
  }
  return false;
};

export const handleImagePaste = (
  editor: Editor,
  event: ClipboardEvent,
  uploadFn: UploadFileFn,
) => {
  event.preventDefault();
  const [file] = Array.from(event.clipboardData.files);
  const pos = editor.view.state.selection.from;

  if (file) {
    uploadFn(file, editor, pos);
  }
  return true;
};

type UploadFileFn = (file: File, view: Editor, pos: number) => void;

export const createFileUpload =
  ({ validateFn, onUpload }: ImageUploadOptions): UploadFileFn =>
  (file, editor, pos) => {
    // check if the file is an image
    const validated = validateFn?.(file) as unknown as boolean;
    if (!validated) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    onUpload(file).then((response: any) => {
      editor
        .chain()
        .insertContentAt(pos, [
          {
            type: 'fileExtension',
            attrs: {
              src: response.publicURL,
              alt: response.originalName,
              size: response.size,
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
    });
  };

export const uploadFileFn = createFileUpload({
  onUpload: onUploadFile,
  validateFn: () => {
    return true;
  },
});
