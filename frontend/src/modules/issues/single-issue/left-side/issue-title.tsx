/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Textarea } from 'components/ui/textarea';

interface IssueTitleProps {
  value: string;
  onChange?: (value: string) => void;
}

export function IssueTitle({ value, onChange }: IssueTitleProps) {
  const debouncedUpdates = useDebouncedCallback(async (title: string) => {
    onChange && onChange(title);
  }, 500);

  return (
    <Textarea
      className="border-0 pl-0 font-medium resize-none no-scrollbar overflow-hidden outline-none focus-visible:ring-0 text-xl"
      rows={1}
      cols={1}
      defaultValue={value}
      placeholder="Issue title"
      onChange={(e) => {
        debouncedUpdates(e.currentTarget.value);
      }}
    />
  );
}
