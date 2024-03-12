/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IssueLabelDropdownContent } from 'modules/issues/components';

import { useTeamLabels } from 'hooks/labels';

interface IssueLabelFilterProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  onClose: () => void;
}

export function IssueLabelFilter({ onChange }: IssueLabelFilterProps) {
  const labels = useTeamLabels();

  return (
    <IssueLabelDropdownContent value={[]} onChange={onChange} labels={labels} />
  );
}
