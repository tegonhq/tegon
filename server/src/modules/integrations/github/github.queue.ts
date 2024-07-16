import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";

import { EventBody, EventHeaders } from "../integrations.interface";

@Injectable()
export class GithubQueue {
  constructor(@InjectQueue("github") private readonly githubQueue: Queue) {}

  async handleEventsJob(eventHeaders: EventHeaders, eventBody: EventBody) {
    await this.githubQueue.add("handleGithubEvents", {
      eventHeaders,
      eventBody,
    });
  }
}
