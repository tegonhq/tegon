/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller({
  version: '1',
  path: 'linked_issue',
})
@ApiTags('Linked Issue')
export class LinkedIssueController {
  constructor() {}
}
