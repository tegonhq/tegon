import type { Editor } from '@tiptap/core';

import axios from 'axios';
import { type ImageUploadOptions } from 'novel/plugins';

const onUploadFile = async (file: File) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const workspaceId = (window as any).workspaceId;
  const formData = new FormData();

  formData.append('files', file);
  const response: any = await axios.post(
    `/api/v1/attachment/upload?workspaceId=${workspaceId}`,
    formData,
  );

  // This should return a src of the uploaded image
  return response.data[0];
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
    const tempFileURL = URL.createObjectURL(file);

    editor
      .chain()
      .insertContentAt(pos, [
        {
          type: 'imageExtension',
          attrs: {
            src: tempFileURL,
            alt: file.name,
            uploading: true,
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

    onUpload(file).then((response: any) => {
      updateNodeAttrs(editor, tempFileURL, {
        src: response.publicURL,
        alt: response.originalName,
        openViewer: false,
      });
    });
  };

export const uploadFn = createImageUpload({
  onUpload: onUploadFile,
  validateFn: () => {
    return true;
  },
});

export const handleMarkAndImagePaste = (
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

    const tempFileURL = URL.createObjectURL(file);

    editor
      .chain()
      .insertContentAt(pos, [
        {
          type: 'fileExtension',
          attrs: {
            src: tempFileURL,
            alt: file.name,
            uploading: true,
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

    onUpload(file).then((response: any) => {
      updateNodeAttrs(editor, tempFileURL, {
        src: response.publicURL,
        alt: response.originalName,
        size: response.size,
        type: response.fileType,
      });
    });
  };

export const uploadFileFn = createFileUpload({
  onUpload: onUploadFile,
  validateFn: () => {
    return true;
  },
});

function updateNodeAttrs(editor: any, url: string, updatedAttrs: any) {
  editor.view.state.doc.descendants((node: any, pos: number) => {
    if (node.attrs?.src === url) {
      const transaction = editor.view.state.tr.setNodeMarkup(
        pos,
        undefined, // Keep the same node type
        updatedAttrs, // Merge new attributes with existing ones
      );
      editor.view.dispatch(transaction); // Apply the transaction
    }
  });
}
