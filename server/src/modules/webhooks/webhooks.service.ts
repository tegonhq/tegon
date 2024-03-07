import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';


@Injectable()
export default class WebhookService {
  constructor(private prisma: PrismaService) {}
}