import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';


@Injectable()
export default class GithubService {
  constructor(private prisma: PrismaService) {}
}