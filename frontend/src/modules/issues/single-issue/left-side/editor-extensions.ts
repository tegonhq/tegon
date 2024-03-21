/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { mergeAttributes } from '@tiptap/core';
import Heading from '@tiptap/extension-heading';
import { cx } from 'class-variance-authority';
import {
  TiptapLink,
  TaskList,
  TaskItem,
  HorizontalRule,
  StarterKit,
  Placeholder,
} from 'novel/extensions';

// TODO I am using cx here to get tailwind autocomplete working, idk if someone else can write a regex to just capture the class key in objects

const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx(
      'text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer',
    ),
  },
});

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx('not-prose'),
  },
});
const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx('flex items-center gap-2 editor-checkbox mb-2'),
  },
  nested: false,
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx('mt-4 mb-6 border-t border-muted-foreground'),
  },
});

const heading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level: 1 | 2 | 3 = hasLevel
      ? node.attrs.level
      : this.options.levels[0];
    const levelMap = { 1: 'text-xl', 2: 'text-lg', 3: 'text-base' };

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `h${node.attrs.level}-style ${levelMap[level]}`,
      }),
      0,
    ];
  },
}).configure({ levels: [1, 2, 3] });

const starterKit = StarterKit.configure({
  heading: false,
  bulletList: {
    HTMLAttributes: {
      class: cx('list-disc list-outside leading-3 pl-4'),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cx('list-decimal list-outside pl-4 leading-3'),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cx('leading-normal'),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cx('border-l-4 border-slate-400 dark:border-slate-500'),
    },
  },
  codeBlock: {
    HTMLAttributes: {
      class: cx('rounded-sm bg-muted border p-5 font-mono font-medium'),
    },
  },
  code: {
    HTMLAttributes: {
      class: cx('rounded-md bg-muted px-1.5 py-1 font-mono font-medium'),
      spellcheck: 'false',
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: '#DBEAFE',
    width: 4,
  },
  gapcursor: false,
});

const placeholder = Placeholder.configure({
  placeholder: ({ node }) => {
    if (node.type.name === 'heading') {
      return `Heading ${node.attrs.level}`;
    }
    if (node.type.name === 'image' || node.type.name === 'table') {
      return '';
    }
    if (node.type.name === 'codeBlock') {
      return 'Type in your code here...';
    }

    return 'Add description...';
  },
  includeChildren: true,
});

export const defaultExtensions = [
  starterKit,
  placeholder,
  tiptapLink,
  taskList,
  taskItem,
  horizontalRule,
  heading,
];
