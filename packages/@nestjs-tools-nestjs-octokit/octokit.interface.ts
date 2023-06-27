import { ModuleMetadata, Scope, Type } from '@nestjs/common';
import { Octokit } from 'octokit';

export interface ModuleOptions {
  options?: ConstructorParameters<typeof Octokit>[0];
  plugins?: Parameters<(typeof Octokit)['plugin']>;
}

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
