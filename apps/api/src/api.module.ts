import { Module } from '@nestjs/common';
import { PrismaService } from './infra/prisma/prisma.service';
import { NewsModule } from './modules/news/news.module';
import { ConfigModule } from '@nestjs/config';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), NewsModule, SearchModule],
  controllers: [],
  providers: [PrismaService],
})
export class ApiModule {}
