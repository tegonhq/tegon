import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class BullService {
  private queues: Map<string, Queue> = new Map();

  async getQueueStatus(queueName: string) {
    const queue = this.getQueue(queueName);
    const jobCounts = await queue.getJobCounts();
    const isPaused = await queue.isPaused();

    return {
      name: queueName,
      jobCounts,
      isPaused,
    };
  }

  private getQueue(queueName: string): Queue {
    let queue = this.queues.get(queueName);
    return queue;
  }
}
