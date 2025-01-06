import { cn } from '@tegonhq/ui/lib/utils';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

import type { User } from 'common/types';

interface MentionListProps {
  items: User[];
  command: (args: { id: string }) => void;
}

export const MentionList = forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (props: MentionListProps, ref: React.Ref<any>) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = props.items[index];

      if (item) {
        props.command({ id: item.id });
      }
    };

    const upHandler = () => {
      setSelectedIndex(
        (prevIndex) =>
          (prevIndex + props.items.length - 1) % props.items.length,
      );
    };

    const downHandler = () => {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => {
      setSelectedIndex(0);
    }, [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        switch (event.key) {
          case 'ArrowUp':
            upHandler();
            return true;
          case 'ArrowDown':
            downHandler();
            return true;
          case 'Enter':
            enterHandler();
            return true;
          default:
            return false;
        }
      },
    }));

    return (
      <div className="bg-popover border border-border rounded shadow flex flex-col gap-0.5 overflow-auto p-1 relative">
        {props.items.length > 0 ? (
          props.items.map((item, index) => (
            <button
              className={cn(
                'flex items-center gap-1 w-full text-left bg-transparent hover:bg-grayAlpha-100 p-1',
                index === selectedIndex ? 'bg-grayAlpha-100' : '',
              )}
              key={index}
              onClick={() => selectItem(index)}
            >
              {item.fullname}
            </button>
          ))
        ) : (
          <div className="item">No result</div>
        )}
      </div>
    );
  },
);

MentionList.displayName = 'MentionList';
