/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { Textarea } from 'components/ui/textarea';

interface IssueTitleProps {
  defaultValue: string;
}

export function IssueTitle({ defaultValue }: IssueTitleProps) {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <Textarea
      className="border-0 pl-0 font-medium resize-none no-scrollbar overflow-hidden outline-none focus-visible:ring-0 text-xl"
      value={value}
      rows={1}
      cols={1}
      placeholder="Issue title"
      onChange={(e) => {
        setValue(e.currentTarget.value);
      }}
    />
  );
}
