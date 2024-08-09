import { useUpdateIssueSubscribeMutation } from 'services/issues';
import { SubscribeType } from 'common/types';
import { Button } from '@tegonhq/ui/components/button';
import { useToast } from '@tegonhq/ui/components/use-toast';
import React from 'react';

import { useIssueData } from 'hooks/issues';

import { UserContext } from 'store/user-context';

import { SubscribeDropdown } from './subscribe-dropdown';

export function SubscribeView() {
  const issue = useIssueData();
  const { toast } = useToast();

  const user = React.useContext(UserContext);
  const subscribed = issue.subscriberIds.includes(user.id);
  const { mutate: toggleSubscribed } = useUpdateIssueSubscribeMutation({
    onSuccess: () => {
      toast({
        description: `You have ${subscribed ? 'unsubscribed' : 'subscribed'} to issue ${issue.number}`,
      });
    },
  });

  const toggleSubscribe = () => {
    toggleSubscribed({
      type: subscribed ? SubscribeType.UNSUBSCRIBE : SubscribeType.SUBSCRIBE,
      issueId: issue.id,
    });
  };

  return (
    <div className="flex gap-2 items-center">
      <div>
        <Button variant="ghost" onClick={toggleSubscribe}>
          {subscribed ? 'Unsubscribe' : 'Subscribe'}
        </Button>
      </div>
      {issue.subscriberIds.length > 0 && (
        <div className="flex">
          <SubscribeDropdown value={issue.subscriberIds} />
        </div>
      )}
    </div>
  );
}
