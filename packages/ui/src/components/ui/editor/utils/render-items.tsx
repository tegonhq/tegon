// This file is copy of novel.sh render items, we made a copy of this
// as the slash command is not working when used inside a modal
import type { Editor } from '@tiptap/core';

import { ReactRenderer } from '@tiptap/react';
import { Provider } from 'jotai';
import { useSetAtom, useAtom } from 'jotai';
import React from 'react';
import tippy from 'tippy.js';
import tunnel from 'tunnel-rat';

import {
  Command,
  CommandInput,
  CommandList,
} from '@tegonhq/ui/components/command';

import { queryAtom, rangeAtom } from './atoms';
import { novelStore } from './store';

export const EditorCommandTunnelContext = React.createContext(
  {} as ReturnType<typeof tunnel>,
);

interface EditorRootProps {
  readonly children: React.ReactNode;
}

interface EditorCommandOutProps {
  readonly query: string;
  readonly range: Range;
}

export const EditorRoot: React.FC<EditorRootProps> = ({ children }) => {
  const tunnelInstance = React.useRef(tunnel()).current;

  return (
    <Provider store={novelStore}>
      <EditorCommandTunnelContext.Provider value={tunnelInstance}>
        {children}
      </EditorCommandTunnelContext.Provider>
    </Provider>
  );
};

export const EditorCommandOut: React.FC<EditorCommandOutProps> = ({
  query,
  range,
}) => {
  const setQuery = useSetAtom(queryAtom, { store: novelStore });
  // @ts-expect-error Taken from the source
  const setRange = useSetAtom(rangeAtom, { store: novelStore });

  React.useEffect(() => {
    setQuery(query);
  }, [query, setQuery]);

  React.useEffect(() => {
    setRange(range);
  }, [range, setRange]);

  React.useEffect(() => {
    const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];
    // @ts-expect-error Taken from the source
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        const commandRef = document.querySelector('#slash-command');

        if (commandRef) {
          commandRef.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: e.key,
              cancelable: true,
              bubbles: true,
            }),
          );
        }

        return false;
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <EditorCommandTunnelContext.Consumer>
      {(tunnelInstance) => <tunnelInstance.Out />}
    </EditorCommandTunnelContext.Consumer>
  );
};

export const EditorCommand = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Command>
>(({ children, className, ...rest }, ref) => {
  const commandListRef = React.useRef<HTMLDivElement>(null);
  const [query, setQuery] = useAtom(queryAtom);

  return (
    <EditorCommandTunnelContext.Consumer>
      {(tunnelInstance) => (
        <tunnelInstance.In>
          <Command
            ref={ref}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            id="slash-command"
            className={className}
            {...rest}
          >
            <CommandInput
              value={query}
              onValueChange={setQuery}
              containerClassName="hidden"
            />
            <CommandList className="overflow-auto h-48" ref={commandListRef}>
              {children}
            </CommandList>
          </Command>
        </tunnelInstance.In>
      )}
    </EditorCommandTunnelContext.Consumer>
  );
});

EditorCommand.displayName = 'EditorCommand';

export const renderItems = () => {
  let component: ReactRenderer | null = null;
  let popup: any | null = null;

  return {
    // @ts-expect-error Taken from the source
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      component = new ReactRenderer(EditorCommandOut, {
        props,
        editor: props.editor,
      });

      const { selection } = props.editor.state;

      const parentNode = selection.$from.node(selection.$from.depth);
      const blockType = parentNode.type.name;

      if (blockType === 'codeBlock') {
        return false;
      }

      // @ts-expect-error Taken from the source
      popup = tippy('body', {
        getReferenceClientRect: props.clientRect,
        appendTo: () =>
          document.querySelector('.new-issue-form') ?? document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
      });
    },
    onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
      component?.updateProps(props);

      popup &&
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
    },

    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === 'Escape') {
        popup?.[0].hide();

        return true;
      }

      // @ts-expect-error Taken from the source
      return component?.ref?.onKeyDown(props);
    },
    onExit: () => {
      popup?.[0].destroy();
      component?.destroy();
    },
  };
};
