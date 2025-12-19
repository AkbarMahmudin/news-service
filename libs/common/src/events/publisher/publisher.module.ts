import { DynamicModule, Module } from '@nestjs/common';
import { PublisherService } from '@app/common/events/publisher/publisher.service';
import { RmqModuleOptions } from '@app/common/interfaces/rmq-module-options.interface';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [PublisherService],
  exports: [PublisherService],
})
export class PublisherModule {
  static register({ name }: RmqModuleOptions): DynamicModule {
    return {
      module: PublisherModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('RABBIT_MQ_URI')],
                queue: configService.get<string>(`RABBIT_MQ_${name}_QUEUE`),
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
