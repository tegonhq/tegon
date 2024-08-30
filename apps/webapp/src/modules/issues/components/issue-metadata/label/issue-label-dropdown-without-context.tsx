import { observer } from 'mobx-react-lite';
import React from 'react';

import { IssueLabelDropdownContent } from 'modules/issues/components';

import { useTeamLabels } from 'hooks/labels';

interface IssueLabelDropdownWithoutContextProps {
  value?: string[];
  input?: string;
  onChange?: (value: string[]) => void;
  onClose: () => void;
  teamIdentifier?: string;
}

export const IssueLabelDropdownWithoutContext = observer(
  ({
    onChange,
    value,
    input,
    teamIdentifier,
  }: IssueLabelDropdownWithoutContextProps) => {
    const [labelSearch, setLabelSearch] = React.useState('');
    const labels = useTeamLabels(teamIdentifier);

    React.useEffect(() => {
      if (input) {
        setLabelSearch(input);
      }
    }, [input]);

    return (
      <IssueLabelDropdownContent
        value={value}
        onChange={onChange}
        labels={labels}
        labelSearch={labelSearch}
        setLabelSearch={setLabelSearch}
      />
    );
  },
);
