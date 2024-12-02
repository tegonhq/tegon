import { RiDownloadLine } from '@remixicon/react';
import { NodeViewWrapper } from '@tiptap/react';
import { filesize } from 'filesize';
import React from 'react';

import { DocumentLine } from '@tegonhq/ui/icons';

import { Button } from '../../button';
import { Loader } from '../../loader';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FileComponent = (props: any) => {
  const type = props.node.attrs.type;

  return (
    <NodeViewWrapper className="react-component-with-content">
      <div className="content">
        <div className="relative flex w-fit items-center rounded-lg bg-grayAlpha-100 p-2 gap-2 my-1 overflow-hidden w-fit">
          {type && type.includes('video/') ? (
            <>
              <div className="">
                <video
                  controls={true}
                  src={props.node.attrs.src}
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
                      window.open(props.node.attrs.src, '_blank');
                    }}
                  >
                    <RiDownloadLine size={14} />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
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
                  window.open(
                    props.node.attrs.src
                      ? props.node.attrs.src
                      : props.node.attrs.url,
                    '_blank',
                  );
                }}
              >
                <RiDownloadLine size={16} />
              </Button>
            </>
          )}

          {props.node.attrs.uploading && (
            <div className="absolute left-0 top-0 w-full h-full rounded-md bg-grayAlpha-200 flex items-center">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};
