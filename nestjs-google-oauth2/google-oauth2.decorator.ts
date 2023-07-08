import { Inject } from '@nestjs/common';

import { MODULE_OPTIONS_TOKEN } from './google-oauth2.module-definition';

export const InjectGoogleOauth2Options = (alias?: string) => {
  return Inject(MODULE_OPTIONS_TOKEN);
};
