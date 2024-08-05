import { Injectable } from '@nestjs/common';
import { EventBody, EventHeaders } from '@tegonhq/types';
import { runs, tasks, configure } from '@trigger.dev/sdk/v3';

@Injectable()
export default class WebhookService {
  constructor() {
    configure({
      secretKey: 'tr_dev_cyB8MTxcBbP9RpRhp8fO', // WARNING: Never actually hardcode your secret key like this
    });
  }

  async handleEvents(
    sourceName: string,
    eventHeaders: EventHeaders,
    eventBody: EventBody,
  ) {
    const accesstoken =
      'Bearer eyJraWQiOiJkLTE3MjE5NzQyMTUwNjQiLCJ0eXAiOiJKV1QiLCJ2ZXJzaW9uIjoiNSIsImFsZyI6IlJTMjU2In0.eyJpYXQiOjE3MjI1NzY5ODEsImV4cCI6MTcyNTE2ODk4MSwic3ViIjoiZWI0NGQ4ZDMtMDhkYS00NTNmLWJjMjktNGM1MmRhMDhjYjcyIiwidElkIjoicHVibGljIiwicnN1YiI6ImViNDRkOGQzLTA4ZGEtNDUzZi1iYzI5LTRjNTJkYTA4Y2I3MiIsInNlc3Npb25IYW5kbGUiOiI4MGU2MjdkZi0yZjMwLTRjOGQtYWQ0Yy04ZmJlOGIzMjUzNGEiLCJyZWZyZXNoVG9rZW5IYXNoMSI6IjI3Yjg1MzZhNGM5NzM5OGVmNmNlYmY1ZDZlMGI5Y2RlODE5YTJkOGQwZWJhZDhhNmVhNWRhZTgxYzIyYjYxNGMiLCJwYXJlbnRSZWZyZXNoVG9rZW5IYXNoMSI6bnVsbCwiYW50aUNzcmZUb2tlbiI6bnVsbCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMDAxL2F1dGgiLCJzdC1yb2xlIjp7InYiOltdLCJ0IjoxNzIyNTc2OTgxNTMzfSwic3QtcGVybSI6eyJ2IjpbXSwidCI6MTcyMjU3Njk4MTU0MX19.IPfAQ8nPqLQBARKKZgFnm6SCk0DJFQS1RbrudxAwPqHU1GB98zJcsGtiEXfzlEtFaHja-rWK_DMVfrs4PGZOAsWQ4DCmYyUBF2iL0xkHCOwYedURqA9iyn-a0GhsbFQ8iCvJGhQKEpyfL51E2MsEfJtMeE0SDrfnG1e1We1nNkodQgBV3REMspTzQh5Y2zrjDgU9tKnEL0S98_xBBNtiyXOevxRql2fC1_6bzjBVgUBMjHrvK8DCt_SbAv16FONsmEXAFubnRuI1qlRMB7wNvGjDxcULEKZT7H8_1rMGAaowznuwzd6nhCDIM3Mta2TzNQhRpIWLL94We8fvIPeSOQ';
    const handle = await tasks.trigger(`${sourceName}-webhook`, {
      eventHeaders,
      eventBody,
      accesstoken,
    });

    const run = await runs.poll(handle.id);
    return run.output;
  }
}
