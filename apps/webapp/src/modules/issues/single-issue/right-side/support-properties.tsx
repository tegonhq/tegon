import type React from 'react';

import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';

import { useIssueData } from 'hooks/issues';

import { useContextStore } from 'store/global-context-provider';

export const People = observer(({ peopleId }: { peopleId?: string }) => {
  const { peopleStore, companiesStore } = useContextStore();
  const people = peopleId ? peopleStore.getPeopleForId(peopleId) : undefined;

  if (!people) {
    return null;
  }

  const company = people?.companyId
    ? companiesStore.getCompanyForId(people.companyId)
    : undefined;

  return (
    <>
      {people && (
        <div className={cn('flex flex-col items-start')}>
          <div className="text-xs text-left">User</div>
          <div className="text-left mt-0.5">{people.name}</div>
        </div>
      )}

      {company && (
        <div className={cn('flex flex-col items-start')}>
          <div className="text-xs text-left">Company</div>
          <div className="text-left mt-0.5">{company.name}</div>
        </div>
      )}
    </>
  );
});

export const SupportProperties = observer(() => {
  const { supportStore } = useContextStore();
  const issue = useIssueData();
  const supportData = supportStore.getSupportMetadataForIssue(issue.id);

  if (!supportData) {
    return null;
  }

  return (
    <>
      {supportData.reportedById && (
        <People peopleId={supportData.reportedById} />
      )}
    </>
  );
});
