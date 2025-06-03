import { Inject, Injectable } from '@nestjs/common';
import * as PubNub from 'pubnub';
import { PubnubConfig } from 'pubnub';
import { getOptionsToken } from './pubnub.module-definition';

@Injectable()
export class PubNubService extends PubNub {
  constructor(@Inject(getOptionsToken()) private readonly options: PubnubConfig) {
    super(options);
  }
}
