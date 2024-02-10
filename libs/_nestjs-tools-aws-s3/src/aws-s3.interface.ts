/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ModuleMetadata, Type } from '@nestjs/common';

/**
 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
 */
export interface ModuleOptions {
  /**
   * aws-sdk version
   * @default '2006-03-01'
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#apiVersion-property
   */
  apiVersion?: string;

  region?: string;

  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
  };
}

export interface ExtraModuleOptions {
  /**
   * alias for module
   * @default ''
   */
  alias?: string;

  /**
   * global module
   * @default false
   */
  global?: boolean;
}

export interface ModuleOptionsFactory {
  create(): Promise<ModuleOptions> | ModuleOptions;
}

export interface AsyncModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<ModuleOptionsFactory>;
  useExisting?: Type<ModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<ModuleOptions> | ModuleOptions;
}
