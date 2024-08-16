import {
  MiddlewareConsumer,
  Module,
  NestModule,
  DynamicModule,
} from '@nestjs/common';

import { UsersModule } from 'modules/users/users.module';

import { AuthGuard } from './auth.guard';
import { AuthMiddleware } from './auth.middleware';
import { SupertokensService } from './supertokens/supertokens.service';

@Module({
  providers: [SupertokensService, AuthGuard],
  exports: [SupertokensService, AuthGuard],
  imports: [UsersModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }

  static forRoot(): DynamicModule {
    return {
      providers: [SupertokensService],
      exports: [SupertokensService],
      imports: [UsersModule],
      module: AuthModule,
    };
  }
}
