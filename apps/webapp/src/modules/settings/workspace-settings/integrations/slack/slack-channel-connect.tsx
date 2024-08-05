/* eslint-disable @next/next/no-img-element */
import { useSlackChannelCreateRedirectURLMutation } from '@tegonhq/services/oauth';
import { IntegrationName } from 'common/types';
import { Button } from '@tegonhq/ui/components/button';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { SlackChannelSettings } from './slack-channel-settings';
import { useIntegrationAccount } from '../integration-util';

export const SlackChannelConnext = observer(() => {
  const { mutate: createRedirectURL } =
    useSlackChannelCreateRedirectURLMutation({
      onSuccess: (data) => {
        const redirectURL = data.redirectURL;

        window.open(redirectURL);
      },
    });

  const { integrationAccount: slackAccount } = useIntegrationAccount(
    IntegrationName.Slack,
  );

  const getRedirectURL = () => {
    createRedirectURL({
      integrationAccountId: slackAccount.id,
      redirectURL: window.location.href,
    });
  };

  if (!slackAccount) {
    return null;
  }

  const channelMappings = JSON.parse(slackAccount.settings).Slack
    ?.channelMappings;

  return (
    <div className="flex flex-col text-sm rounded-md mt-8 items-center">
      <div className="flex justify-between items-center gap-4 pb-4">
        <div>
          <h3 className="font-medium">Connected Slack channels</h3>
          <p className="text-muted-foreground">
            Automatically import and sync issues from selected Github
            repositories into a designated Team
          </p>
        </div>

        <Button variant="outline" onClick={getRedirectURL}>
          Add channel
        </Button>
      </div>

      {channelMappings && <SlackChannelSettings slackAccount={slackAccount} />}
    </div>
  );
});
