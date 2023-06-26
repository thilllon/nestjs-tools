import { Inject } from '@nestjs/common';

import { getClientToken } from './nodemailer.utils';

export const InjectNodemailer = (alias?: string) => {
  return Inject(getClientToken(alias));
};
