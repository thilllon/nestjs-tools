import { MODULE_CLIENT_TOKEN, MODULE_OPTIONS_TOKEN } from './googleapis.constant';

export function getOptionsToken(alias = ''): string {
  return `${MODULE_OPTIONS_TOKEN}_${alias}`;
}

export function getClientToken(alias = ''): string {
  return `${MODULE_CLIENT_TOKEN}_${alias}`;
}
