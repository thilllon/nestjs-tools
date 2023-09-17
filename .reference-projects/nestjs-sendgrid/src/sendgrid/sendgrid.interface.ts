import { ModuleMetadata, Scope, Type } from '@nestjs/common';

export interface ModuleOptions {
  apiKey?: string;
}

export interface ExtraModuleOptions {
  global?: boolean;
  scope?: Scope;
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
