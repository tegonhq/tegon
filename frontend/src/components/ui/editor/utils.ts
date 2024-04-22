/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { createImageUpload } from 'novel/plugins';

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

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: () => {
    return true;
  },
});
