import { RiDownloadLine } from '@remixicon/react';
import { NodeViewWrapper } from '@tiptap/react';
import { filesize } from 'filesize';
import Player from 'next-video/player';
import React from 'react';

import { DocumentLine } from '@tegonhq/ui/icons';

import { Button } from '../../../ui/button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FileComponent = (props: any) => {
  const type = props.node.attrs.type;

  return (
    <NodeViewWrapper className="react-component-with-content">
      <div className="content">
        {type && type.includes('video/') ? (
          <div className="flex w-fit items-center p-3 bg-grayAlpha-100 rounded-lg gap-2 my-1 hover:border-border hover:border">
            <Player src={props.node.attrs.src} />
          </div>
        ) : (
          <div className="flex w-fit items-center p-3 bg-grayAlpha-100 rounded-lg gap-2 my-1 hover:border-border hover:border">
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
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};
