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
      <div className="flex items-center gap-1 flex-wrap">
        {labels.map((label: LabelType) => (
          <Badge
            variant="secondary"
            key={label.name}
            className="flex items-center gap-1"
          >
            <BadgeColor style={{ backgroundColor: label.color }} />
            {label.name}
          </Badge>
        ))}
      </div>
    );
  };

  return labels.length > 0 ? <>{getLabels()}</> : null;
});
