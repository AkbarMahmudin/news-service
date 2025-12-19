import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateNewsDto } from './dto/create-news.dto';
import { INewsRepository } from './news.repository';
import { NEWS_SERVICE } from '@app/common/constants/service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class NewsService {
  constructor(
    private readonly repo: INewsRepository,
    @Inject(NEWS_SERVICE) private readonly newsPublisher: ClientProxy,
  ) {}

  async create(createNewsDto: CreateNewsDto) {
    const news = await this.repo.create(createNewsDto);

    await lastValueFrom(this.newsPublisher.emit('news:created', { news }));

    return news;
  }

  findAll(page = 1, limit = 10) {
    return this.repo.findMany(page, limit);
  }
}
