import { Controller, Get, Query } from '@nestjs/common';
import { ElasticService } from '@app/common';

@Controller('search')
export class SearchController {
  constructor(private readonly elasticService: ElasticService) {}

  @Get()
  search(@Query('q') q: string) {
    return this.elasticService.search('news', q, [
      'title',
      'content',
      'author',
      'source',
    ]);
  }
}
