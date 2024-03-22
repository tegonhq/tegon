import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { BullController } from './bull.controller';
import { BullService } from './bull.service';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_URL,
          port: Number(process.env.REDIS_PORT),
        },
      }),
    }),
  ],
  exports: [BullModule],
  controllers: [BullController],
  providers: [BullService],
})
export class BullConfigModule {}
