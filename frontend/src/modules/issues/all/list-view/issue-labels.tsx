/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import type { LabelType } from 'common/types/label';

import { Badge } from 'components/ui/badge';

import { useContextStore } from 'store/global-context-provider';

interface IssueLabelsProps {
  labelIds: string[];
}

export const IssueLabels = observer(({ labelIds }: IssueLabelsProps) => {
  const { labelsStore } = useContextStore();

  console.log(labelsStore.labels.toJSON(), labelIds);

  const getLabels = () => {
    const labels = labelsStore.labels.filter((label: LabelType) =>
      labelIds.includes(label.id),
    );

    return (
      <>
        {labels.slice(0, 3).map((label: LabelType) => (
          <Badge
            variant="outline"
            key={label.name}
            className="text-muted-foreground"
          >
            {label.name}
          </Badge>
        ))}
        {labels.length > 3 && (
          <Badge
            variant="outline"
            key="extra"
            className="text-muted-foreground"
          >
            +{labels.length - 3} labels
          </Badge>
        )}
      </>
    );
  };

  return <div className="flex gap-2">{getLabels()}</div>;
});
