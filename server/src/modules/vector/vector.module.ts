import { Module } from '@nestjs/common';
import { VectorService } from './vector.service';
import { Client as TypesenseClient } from 'typesense';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule],
  providers: [
    VectorService,
    {
      provide: TypesenseClient,
      useFactory: () =>
        new TypesenseClient({
          nodes: [
            {
              host: process.env.TYPESENSE_HOST,
              port: Number(process.env.TYPESENSE_PORT),
              protocol: process.env.TYPESENSE_PROTOCOL,
            },
          ],
          apiKey: process.env.TYPESENSE_API_KEY,
        }),
    },
  ],
  exports: [VectorService],
})
export class VectorModule {}
