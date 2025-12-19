import { Module } from '@nestjs/common';
import { ConsumersModule } from './consumers/consumers.module';
import { ElasticModule } from '@app/common';

@Module({
  imports: [ConsumersModule, ElasticModule],
  controllers: [],
  providers: [],
})
export class WorkerModule {}
