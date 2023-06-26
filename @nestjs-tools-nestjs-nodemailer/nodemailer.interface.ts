import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { Transport, TransportOptions, SendMailOptions } from 'nodemailer';

import type * as JSONTransport from 'nodemailer/lib/json-transport';
import type * as SendmailTransport from 'nodemailer/lib/sendmail-transport';
import type * as SESTransport from 'nodemailer/lib/ses-transport';
import type * as SMTPPool from 'nodemailer/lib/smtp-pool';
import type * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import type * as StreamTransport from 'nodemailer/lib/stream-transport';

export type { Transport, TransportOptions, SendMailOptions };

export type Mailer = Transport['mailer'];

export type Options =
  | SMTPTransport.Options
  | SMTPPool.Options
  | SendmailTransport.Options
  | StreamTransport.Options
  | JSONTransport.Options
  | SESTransport.Options
  | TransportOptions;

export type TransportType =
  | Options
  | SMTPTransport
  | SMTPPool
  | SendmailTransport
  | StreamTransport
  | JSONTransport
  | SESTransport
  | Transport
  | string;

export interface ModuleOptions {
  transport?: TransportType;
  defaults?: Options;
}

export type ExtraModuleOptions = {
  /**
   * make the module global
   * @default false
   */
  global?: boolean;

  /**
   * alias for the module
   * @default ''
   */
  alias?: string;
};

export interface ModuleOptionsFactory {
  createModuleOptions(): Promise<ModuleOptions> | ModuleOptions;
}

export interface AsyncModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<ModuleOptionsFactory>;
  useExisting?: Type<ModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<ModuleOptions> | ModuleOptions;
}
