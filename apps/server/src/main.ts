import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import supertokens from 'supertokens-node';

import type { CorsConfig } from 'common/configs/config.interface';

import ReplicationService from 'modules/replication/replication.service';
import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';

import { AppModule } from './app.module';
import { LoggerService } from 'modules/logger/logger.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService('Tegon'),
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe({}));

  // Initiate replication service
  const replicationService = app.get(ReplicationService);
  replicationService.init();

  // Initiate trigger service
  const triggerService = app.get(TriggerdevService);
  triggerService.initCommonProject();

  // enable shutdown hook
  app.enableShutdownHooks();

  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const configService = app.get(ConfigService);
  const corsConfig = configService.get<CorsConfig>('cors');

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Cors
  if (corsConfig.enabled) {
    app.enableCors({
      origin: configService.get('FRONTEND_HOST').split(',') || '',
      allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
      credentials: true,
    });
  }

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
