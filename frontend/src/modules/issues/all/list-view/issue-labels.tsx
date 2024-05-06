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
        {labels.slice(0, 2).map((label: LabelType) => (
          <Badge
            variant="outline"
            key={label.name}
            className="text-muted-foreground flex items-center"
          >
            <BadgeColor style={{ backgroundColor: label.color }} />
            {label.name}
          </Badge>
        ))}
        {labels.length > 2 && (
          <Badge
            variant="outline"
            key="extra"
            className="text-muted-foreground"
          >
            +{labels.length - 2} labels
          </Badge>
        )}
      </>
    );
  };

  return labels.length > 0 ? <>{getLabels()}</> : null;
});
