import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { NewsRepository, INewsRepository } from './news.repository';
import { PublisherModule } from '@app/common';
import { NEWS_SERVICE } from '@app/common/constants/service';

@Module({
  imports: [PublisherModule.register({ name: NEWS_SERVICE })],
  controllers: [NewsController],
  providers: [
    PrismaService,
    NewsService,
    {
      provide: INewsRepository,
      useClass: NewsRepository,
    },
  ],
})
export class NewsModule {}
