import { ActionTypesEnum, LinkedIssue, ModelNameEnum } from '@tegonhq/types';
import { task } from '@trigger.dev/sdk/v3';

import { triggerTask } from 'common/utils/trigger.utils';

export const linkIssueTrigger = task({
  id: 'link-issue',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run: async (payload: any) => {
    const linkedIssue: LinkedIssue = payload.linkedIssue;

    const handle = await triggerTask(`-handler`, {
      event: ActionTypesEnum.OnCreate,
      payload: {
        userId: linkedIssue.createdById,
        data: {
          type: ModelNameEnum.LinkedIssue,
          linkIssueId: linkedIssue.id,
        },
      },
    });

    return {
      message: `Triggered handler task with id: ${handle.id}`,
    };
  },
});
