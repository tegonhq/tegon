import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";

import GithubService from "./github.service";
import { EventBody, EventHeaders } from "../integrations.interface";

@Processor("github")
export class GithubProcessor {
  constructor(private githubService: GithubService) {}
  private readonly logger: Logger = new Logger("GithubProcessor");

  @Process("handleGithubEvents")
  async handleTwoWaySync(
    job: Job<{
      eventHeaders: EventHeaders;
      eventBody: EventBody;
    }>,
  ) {
    const { eventHeaders, eventBody } = job.data;
    this.logger.debug(
      `Handling two-way sync for github ${eventHeaders["x-github-event"]} with action ${eventBody.action}`,
    );
    await this.githubService.handleEvents(eventHeaders, eventBody);
  }
}
