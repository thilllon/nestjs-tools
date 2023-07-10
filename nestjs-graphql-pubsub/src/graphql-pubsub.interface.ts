import { ModuleMetadata, Type } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';

/**
 * pubsub implementation instance which implements `PubSubEngine` interface from the `graphql-subscriptions` package.
 */
export interface ModuleOptions {
  pubsub: PubSubEngine;
}

export interface ExtraModuleOptions {
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
}

export interface ModuleOptionsFactory {
  createModuleOptions(): Promise<ModuleOptions> | ModuleOptions;
}

export interface AsyncModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<ModuleOptionsFactory>;
  useExisting?: Type<ModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<ModuleOptions> | ModuleOptions;
}
