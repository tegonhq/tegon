import { RiDownloadLine } from '@remixicon/react';
import { NodeViewWrapper } from '@tiptap/react';
import { filesize } from 'filesize';
import React from 'react';

import { LinkLine } from '@tegonhq/ui/icons';

import { Button } from '../../../ui/button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FileComponent = (props: any) => {
  return (
    <NodeViewWrapper className="react-component-with-content">
      <div className="content">
        <div
          className="flex w-fit items-center p-3 bg-grayAlpha-100 rounded-lg gap-2 hover:bg-accent/50 my-1"
          onClick={() => {
            window.open(
              props.node.attrs.src
                ? props.node.attrs.src
                : props.node.attrs.url,
              '_blank',
            );
          }}
        >
          <LinkLine size={20} />

          <div className="grow text-sm flex flex-col justify-center">
            <div>{props.node.attrs.alt}</div>
            {props.node.attrs.size > 0 && (
              <div>
                {filesize(props.node.attrs.size, { standard: 'jedec' })}
              </div>
            )}
          </div>

          <Button variant="ghost">
            <RiDownloadLine
              size={16}
              onClick={() => {
                window.open(
                  props.node.attrs.src
                    ? props.node.attrs.src
                    : props.node.attrs.url,
                  '_blank',
                );
              }}
            />
          </Button>
        </div>
      </div>
    </NodeViewWrapper>
  );
};
