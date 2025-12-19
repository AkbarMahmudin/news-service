import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { News } from '../../../generated/prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';

export abstract class INewsRepository {
  abstract create(data: CreateNewsDto): Promise<News>;

  abstract findMany(page: number, limit: number): Promise<[News[], number]>;
}

@Injectable()
export class NewsRepository implements INewsRepository {
  constructor(private prisma: PrismaService) {}

  create(data: CreateNewsDto): Promise<News> {
    return this.prisma.news.create({ data });
  }

  async findMany(page: number, limit: number): Promise<[News[], number]> {
    const [data, count] = await this.prisma.$transaction([
      this.prisma.news.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.news.count(),
    ]);

    return [data, count];
  }
}
