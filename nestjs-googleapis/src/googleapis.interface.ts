import { ModuleMetadata, Type } from '@nestjs/common';
import { JWTOptions } from 'google-auth-library';

export interface ModuleOptions extends JWTOptions {}

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
