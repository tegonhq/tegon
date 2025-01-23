function getAttachmentId(defaultSrc: string, attachmentId: string) {
  if (defaultSrc.includes('blob:')) {
    return undefined;
  }

  return attachmentId ? attachmentId : defaultSrc.split('/').pop();
}

export const useSrc = (defaultSrc: string, attachmentId: string) => {
  const computeAttachmentID = getAttachmentId(defaultSrc, attachmentId);

  return { src: `/api/v1/attachment/${computeAttachmentID}` };
};
