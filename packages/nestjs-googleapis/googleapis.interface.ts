import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { JWTOptions } from 'google-auth-library';

export type ModuleOptions = JWTOptions;

export interface OptionsFactory {
  createOptions(): Promise<ModuleOptions> | ModuleOptions;
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
