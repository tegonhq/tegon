import type { Editor } from '@tiptap/core';

import { createImageUpload, type ImageUploadOptions } from 'novel/plugins';

// interface UploadResponse {
//   publicURL: string;
//   originalName: string;
//   size: number;
// }

const onUpload = async (file: File) => {
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
  return responseJSON[0].publicURL;
};

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

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: () => {
    return true;
  },
});

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
        .insertContentAt(pos, {
          type: 'fileExtension',
          attrs: {
            src: response.publicURL,
            alt: response.originalName,
            size: response.size,
          },
        })
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
