import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ALSMiddleware } from './als.middleware';
import { ALSService } from './als.service';

@Module({
  providers: [ALSService],
  exports: [ALSService],
})
export class ALSModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ALSMiddleware).forRoutes('*');
  }
}
