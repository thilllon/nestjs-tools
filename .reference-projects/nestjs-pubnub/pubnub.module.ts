import { ConfigurableModuleBuilder, Inject, Injectable, Module } from '@nestjs/common';
import * as PubNub from 'pubnub';
import { PubnubConfig } from 'pubnub';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<PubnubConfig>().build();

export const getOptionsToken = (alias?: string) => {
  return MODULE_OPTIONS_TOKEN.toString() + alias;
};

@Injectable()
export class PubNubService extends PubNub {
  constructor(@Inject(getOptionsToken()) private readonly options: PubnubConfig) {
    super(options);
  }
}

// new PubNub({
//   publishKey: 'myPublishKey',
//   subscribeKey: 'mySubscribeKey',
//   userId: 'myUniqueUserId',
// });

@Module({
  providers: [PubNubService],
  exports: [PubNubService],
})
export class PubNubModule extends ConfigurableModuleClass {}

@Module({
  imports: [
    PubNubModule.registerAsync({
      inject: [],
      useFactory: () => {
        // https://admin.pubnub.com/#/user/609657/account/609601/app/35447966/key/1170334/?tab=getStarted
        return {
          userId: 'sdfsdfsd',
          publishKey: 'pub-c-cfc332af-92f4-4ecb-b8e2-8c1a2cb1f480',
          subscribeKey: 'sub-c-249c494e-b193-4d03-a3bc-2b8ffb8e1344',
          secretKey: '',
        };
      },
    }),
  ],
})
export class ChatModule {}

export class ChatService {
  private readonly pubNub: PubNub;
  constructor(
    private readonly pubNubService: PubNubService,
    @Inject(getOptionsToken()) private readonly options: PubnubConfig,
  ) {
    this.pubNub = new PubNub(options);
  }

  async sendMessage(channel: string, message: string) {
    return this.pubNubService.publish({
      channel,
      message,
    });
  }
}
