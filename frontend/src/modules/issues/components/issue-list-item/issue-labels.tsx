/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import type { LabelType } from 'common/types/label';

import { Badge, BadgeColor } from 'components/ui/badge';

import { useContextStore } from 'store/global-context-provider';

interface IssueLabelsProps {
  labelIds: string[];
}

export const IssueLabels = observer(({ labelIds }: IssueLabelsProps) => {
  const { labelsStore } = useContextStore();
  const labels = labelsStore.labels.filter((label: LabelType) =>
    labelIds.includes(label.id),
  );

  const getLabels = () => {
    return (
      <>
        {labels.map((label: LabelType) => (
          <Badge
            variant="secondary"
            key={label.name}
            className="flex items-center"
          >
            <BadgeColor style={{ backgroundColor: label.color }} />
            {label.name}
          </Badge>
        ))}
      </>
    );
  };

  return labels.length > 0 ? <>{getLabels()}</> : null;
});
