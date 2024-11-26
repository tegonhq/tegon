import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { observer } from 'mobx-react-lite';

import { useTriageGroups } from 'hooks';
import { useUsersData } from 'hooks/users';

import { TriageCategory } from './triage-category';
import { TriageOtherCategory } from './triage-other-category';

export const TriageIssues = observer(() => {
  const { users, isLoading } = useUsersData();

  const issueCategories = useTriageGroups();

  if (isLoading) {
    return null;
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col pt-2 pb-14 gap-3">
        {Object.keys(issueCategories).map((labelId: string) => {
          if (labelId === 'other') {
            return (
              <TriageOtherCategory
                issues={issueCategories[labelId]}
                key={labelId}
                noHeader={Object.keys(issueCategories).length === 1}
                users={users}
              />
            );
          }

          return (
            <TriageCategory
              labelId={labelId}
              issues={issueCategories[labelId]}
              key={labelId}
              users={users}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
});
