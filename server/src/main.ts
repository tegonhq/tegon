/** Copyright (c) 2024, Tegon, all rights reserved. **/

/* eslint-disable dot-location */

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import supertokens from 'supertokens-node';

import type { CorsConfig } from 'common/configs/config.interface';

import ReplicationService from 'modules/replication/replication.service';

import { AppModule } from './app.module';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Initiate replication service
  const replicationService = app.get(ReplicationService);
  replicationService.init();

  // enable shutdown hook
  app.enableShutdownHooks();

  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const configService = app.get(ConfigService);
  const corsConfig = configService.get<CorsConfig>('cors');

  // // Swagger Api
  // const options = new DocumentBuilder()
  //   .setTitle('Tegon server')
  //   .setDescription('Tegon server API configuration')
  //   .setVersion('1.0')
  //   .build();
  // const document = SwaggerModule.createDocument(app, options);

  // SwaggerModule.setup('', app, document);

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
