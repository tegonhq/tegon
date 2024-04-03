/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  DynamicModule,
} from '@nestjs/common';

import { UsersModule } from 'modules/users/users.module';

import { AuthMiddleware } from './auth.middleware';
import { SupertokensService } from './supertokens/supertokens.service';

@Module({
  providers: [SupertokensService],
  exports: [],
  controllers: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }

  static forRoot(): DynamicModule {
    return {
      providers: [SupertokensService],
      exports: [],
      imports: [UsersModule],
      module: AuthModule,
    };
  }
}
