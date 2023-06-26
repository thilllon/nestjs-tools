import { MODULE_CLIENT_TOKEN, MODULE_OPTIONS_TOKEN } from './nodemailer.constants';

export function getOptionsToken(alias = ''): string {
  return `${MODULE_OPTIONS_TOKEN}_${alias}`;
}

export function getClientToken(alias = ''): string {
  return `${MODULE_CLIENT_TOKEN}_${alias}`;
}
