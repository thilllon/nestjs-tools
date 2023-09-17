import { MODULE_CLIENT_TOKEN, MODULE_OPTIONS_TOKEN } from './sendgrid.constants';

export const getOptionsToken = (alias?: string) =>
  MODULE_OPTIONS_TOKEN + (alias ? '_' + alias : '');
export const getClientToken = (alias?: string) => MODULE_CLIENT_TOKEN + (alias ? '_' + alias : '');
