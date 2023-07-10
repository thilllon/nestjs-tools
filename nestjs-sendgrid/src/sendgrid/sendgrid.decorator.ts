import { Inject } from '@nestjs/common';
import { MODULE_CLIENT_TOKEN } from './sendgrid.constants';

export function InjectSendgrid() {
  return Inject(MODULE_CLIENT_TOKEN);
}
