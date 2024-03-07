/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { Textarea } from 'components/ui/textarea';

interface IssueDescriptionProps {
  defaultValue: string;
}

export function IssueDescription({ defaultValue }: IssueDescriptionProps) {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <Textarea
      className="border-0 pl-0 resize-none no-scrollbar overflow-hidden outline-none focus-visible:ring-0 text-sm text-gray-800 dark:text-gray-300"
      value={value}
      placeholder="Add description..."
      onChange={(e) => {
        setValue(e.currentTarget.value);
      }}
    />
  );
}
