/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import type { LabelType } from 'common/types/label';

import { Badge, BadgeColor } from 'components/ui/badge';

import { useContextStore } from 'store/global-context-provider';

interface IssueLabelsProps {
  labelIds: string[];
  boardView?: boolean;
}

export const IssueLabels = observer(
  ({ labelIds, boardView = false }: IssueLabelsProps) => {
    const { labelsStore } = useContextStore();
    const labels = labelsStore.labels.filter((label: LabelType) =>
      labelIds.includes(label.id),
    );

    const getLabels = () => {
      return (
        <>
          {labels.slice(0, 3).map((label: LabelType) => (
            <Badge
              variant="outline"
              key={label.name}
              className="text-muted-foreground flex items-center"
            >
              <BadgeColor style={{ backgroundColor: label.color }} />
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

    if (boardView) {
      return labels.length > 0 ? <>{getLabels()}</> : null;
    }

    return labels.length > 0 ? (
      <div className="flex gap-2">{getLabels()}</div>
    ) : null;
  },
);
