import { RiDownloadLine } from '@remixicon/react';
import { NodeViewWrapper } from '@tiptap/react';
import { filesize } from 'filesize';
import React from 'react';

import { DocumentLine } from '@tegonhq/ui/icons';

import { useSrc } from './use-src';
import { Button } from '../../button';
import { Loader } from '../../loader';
import { Progress } from '../../progress';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FileComponent = (props: any) => {
  const type = props.node.attrs.type;
  const { loading, src } = useSrc(
    props.node.attrs.src,
    props.node.attrs.attachmentId,
  );

  if (loading) {
    return null;
  }

  return (
    <NodeViewWrapper className="react-component-with-content">
      <div className="content">
        <div className="relative flex w-fit items-center rounded-lg bg-grayAlpha-100 p-2 gap-2 my-1 overflow-hidden w-fit">
          {type && type.includes('video/') ? (
            <>
              <div className="">
                <video
                  controls={true}
                  src={src}
                  className="w-full h-full rounded-md"
                />
              </div>
              {!props.node.attrs.uploading && (
                <div className="flex bg-background-3 rounded absolute right-4 top-4 p-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    className="px-1"
                    onClick={() => {
                      window.open(src, '_blank');
                    }}
                  >
                    <RiDownloadLine size={14} />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex flex-col">
                <div className="flex gap-2 items-center">
                  <DocumentLine size={20} />

                  <div className="grow text-sm flex flex-col justify-center">
                    <div>{props.node.attrs.alt}</div>
                    {props.node.attrs.size > 0 && (
                      <div>
                        {filesize(props.node.attrs.size, { standard: 'jedec' })}
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    className="bg-grayAlpha-100"
                    onClick={() => {
                      window.open(src, '_blank');
                    }}
                  >
                    <RiDownloadLine size={16} />
                  </Button>
                </div>

                {props.node.attrs.uploading && (
                  <div className="w-full mt-2">
                    <Progress
                      color="#1a89c5"
                      segments={[{ value: props.node.attrs.progress }]}
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {props.node.attrs.uploading && (
            <>
              <div className="absolute left-0 top-0 w-full h-full rounded-md bg-grayAlpha-200 flex items-center">
                <Loader />
              </div>
            </>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};
