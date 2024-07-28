import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [PrismaService],
  exports: [],
})
export class PromptsModule {}
