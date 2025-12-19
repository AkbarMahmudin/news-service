import { Module } from '@nestjs/common';
import { ConsumersService } from './consumers.service';
import { ConsumersController } from './consumers.controller';
import { ConfigModule } from '@nestjs/config';
import { PublisherModule, ElasticModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PublisherModule,
    ElasticModule,
  ],
  controllers: [ConsumersController],
  providers: [ConsumersService],
})
export class ConsumersModule {}
