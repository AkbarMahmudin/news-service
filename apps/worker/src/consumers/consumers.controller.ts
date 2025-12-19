import { Controller } from '@nestjs/common';
import { ConsumersService } from './consumers.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PublisherService } from '@app/common';

@Controller()
export class ConsumersController {
  constructor(
    private readonly consumersService: ConsumersService,
    private readonly publisherService: PublisherService,
  ) {}

  @EventPattern('news:created')
  async consume(@Payload() data: any, @Ctx() ctx: RmqContext) {
    await this.consumersService.consume('news', data?.news);
    this.publisherService.ack(ctx);
  }
}
