import { Inject } from '@nestjs/common';

import { getClientToken } from './googleapis.utils';

export const InjectGoogleApis = (alias?: string) => {
  return Inject(getClientToken(alias));
};

export const InjectGoogleApisOptions = (alias?: string) => {
  return Inject(getClientToken(alias));
};