import { Injectable } from '@nestjs/common';
import { CreateWebhookSubscriptionDto } from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

// import { LoggerService } from 'modules/logger/logger.service';

@Injectable()
export default class WebhookSubscriptionService {
  // private readonly logger: LoggerService = new LoggerService(
  //   'WebhookSubscriptionService',
  // );
  constructor(private prisma: PrismaService) {}

  async getWebhookSubscriptions(workspaceId: string) {
    return await this.prisma.webhookSubscription.findMany({
      where: {
        workspaceId,
        deleted: null,
        isActive: true,
      },
    });
  }

  async createWebhookSubscription(
    workspaceId: string,
    data: CreateWebhookSubscriptionDto,
  ) {
    return await this.prisma.webhookSubscription.create({
      data: {
        ...data,
        workspaceId,
      },
    });
  }

  async updateWebhookSubscription(
    webhookSubscriptionId: string,
    data: Partial<CreateWebhookSubscriptionDto>,
  ) {
    return await this.prisma.webhookSubscription.update({
      where: { id: webhookSubscriptionId },
      data,
    });
  }

  async deleteWebhookSubscription(id: string) {
    return await this.prisma.webhookSubscription.update({
      where: { id },
      data: { deleted: new Date() },
    });
  }
}
