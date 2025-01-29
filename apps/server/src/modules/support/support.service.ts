import { Injectable } from '@nestjs/common';
import { SupportDto, UpdatePersonDto } from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import PeopleService from 'modules/people/people.service';

@Injectable()
export default class SupportService {
  constructor(
    private prisma: PrismaService,
    private peopleService: PeopleService,
  ) {}

  async createSupportData(
    issueId: string,
    workspaceId: string,
    data: SupportDto,
  ) {
    let reportedById = null;

    // If email is provided, find or create person and company
    if (data.email) {
      const person = await this.findOrCreatePerson(data, workspaceId);
      reportedById = person.id;
    }

    // Create support record
    return this.prisma.support.create({
      data: {
        issue: {
          connect: { id: issueId },
        },
        reportedBy: reportedById
          ? {
              connect: { id: reportedById },
            }
          : undefined,
        metadata: data.metadata,
      },
      include: {
        reportedBy: true,
        issue: true,
      },
    });
  }

  private async findOrCreatePerson(data: UpdatePersonDto, workspaceId: string) {
    // Try to find existing person
    const existingPerson = await this.prisma.people.findFirst({
      where: {
        email: data.email,
        deleted: null,
      },
    });

    if (existingPerson) {
      return existingPerson;
    }

    // If person doesn't exist, create new person (and company if needed)
    const name = data.name || data.email.split('@')[0];

    return await this.peopleService.createPerson(
      {
        email: data.email,
        name,
        companyId: data.companyId,
      },
      workspaceId,
    );
  }
}
