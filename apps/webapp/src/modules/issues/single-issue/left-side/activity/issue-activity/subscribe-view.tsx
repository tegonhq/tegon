import { Button } from '@tegonhq/ui/components/button';
import { useToast } from '@tegonhq/ui/components/use-toast';
import React from 'react';

import { SubscribeType } from 'common/types';

import { useIssueData } from 'hooks/issues';

import { useUpdateIssueSubscribeMutation } from 'services/issues';

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
    <div className="flex gap-2 shrink-0 items-center">
      <div>
        <Button variant="ghost" onClick={toggleSubscribe} className="mr-1">
          {subscribed ? 'Unsubscribe' : 'Subscribe'}
        </Button>
      </div>
      {issue.subscriberIds.length > 0 && (
        <SubscribeDropdown value={issue.subscriberIds} />
      )}
    </div>
  );
}
