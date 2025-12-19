import {
  Controller,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { QueryDto } from './dto/query.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  async create(@Body() createNewsDto: CreateNewsDto) {
    const newsCreated = await this.newsService.create(createNewsDto);

    return {
      status: 'ok',
      message: 'News stored and queued',
      id: newsCreated.id,
    };
  }

  @Get()
  async findAll(@Query() { page = 1, limit = 10 }: QueryDto) {
    const [data, total] = await this.newsService.findAll(page, limit);
    return {
      limit,
      page,
      total,
      data,
    };
  }
}
