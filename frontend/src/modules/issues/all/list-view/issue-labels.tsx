/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { LabelType } from 'common/types/label';

import { Badge } from 'components/ui/badge';
import { useLabelsStore } from 'hooks/labels';

interface IssueLabelsProps {
  labelIds: string[];
}

export function IssueLabels({ labelIds }: IssueLabelsProps) {
  const labelsStore = useLabelsStore();

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
}
