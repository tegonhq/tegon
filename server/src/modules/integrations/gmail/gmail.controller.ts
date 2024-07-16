import { Body, Controller, Post, Headers, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { GmailAuthGuard } from "common/gaurds/gmail-auth.gaurd";

import { GmailQueue } from "./gmail.queue";
import { EventBody, EventHeaders } from "../integrations.interface";

@Controller({
  version: "1",
  path: "gmail",
})
@ApiTags("Gmail")
export class GmailController {
  constructor(private gmailQueue: GmailQueue) {}

  @Post()
  @UseGuards(GmailAuthGuard)
  async gmailEvents(
    @Headers() _eventHeaders: EventHeaders,
    @Body() eventBody: EventBody,
  ) {
    this.gmailQueue.handleEventsJob(eventBody);
    return 200;
  }
}
