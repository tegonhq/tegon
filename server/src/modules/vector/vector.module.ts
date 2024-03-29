import { Module } from '@nestjs/common';
import { VectorService } from './vector.service';
import { ChromaClient } from 'chromadb';

@Module({
  providers: [
    VectorService,
    {
      provide: ChromaClient,
      useFactory: () =>
        new ChromaClient({
          path: process.env.CHROMA_HOST,
        }),
    },
  ],
  exports: [VectorService],
})
export class VectorModule {}
