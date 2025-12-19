import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { PublisherService } from '@app/common';
import { NEWS_SERVICE } from '@app/common/constants/service';

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule);
  const publisherService = app.get<PublisherService>(PublisherService);
  app.connectMicroservice(publisherService.getOptions(NEWS_SERVICE));
  await app.startAllMicroservices();
}

bootstrap();
