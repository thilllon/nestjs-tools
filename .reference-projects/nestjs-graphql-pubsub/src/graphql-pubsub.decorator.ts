import { Inject } from '@nestjs/common';

import { getClientToken } from './graphql-pubsub.utils';

export function InjectGraphqlPubsub(alias?: string) {
  return Inject(getClientToken(alias));
}
