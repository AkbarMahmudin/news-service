import { Injectable, Logger } from '@nestjs/common';
import { ElasticService } from '@app/common';

@Injectable()
export class ConsumersService {
  private readonly logger = new Logger(ConsumersService.name);

  constructor(private readonly elasticService: ElasticService) {}

  async consume(name: string, data: any) {
    this.logger.log('Message received');

    await this.elasticService.create(name, data);

    this.logger.log(`Indexed document id=${data?.id}`);
  }
}
