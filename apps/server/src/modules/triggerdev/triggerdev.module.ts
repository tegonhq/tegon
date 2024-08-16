import { Module } from '@nestjs/common';

import { UsersService } from 'modules/users/users.service';

import { TriggerdevService } from './triggerdev.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TriggerdevService, UsersService],
  exports: [TriggerdevService],
})
export class TriggerdevModule {}
