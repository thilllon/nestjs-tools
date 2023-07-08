import { ModuleMetadata, Scope, Type } from '@nestjs/common';

abstract class AbstractConfigService {}

export type ModuleOptions = Type<AbstractConfigService>[];

export type ExtraModuleOptions = {
  global?: boolean;
  scope?: Scope;
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
