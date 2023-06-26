import { StoragePipelineOptions } from '@azure/storage-blob';
import { ModuleMetadata, Scope, Type } from '@nestjs/common';

export type PartialModuleOptions = {
  storageOptions?: StoragePipelineOptions;
  scope?: Scope;
  connection: string;
};

export type ModuleOptions = Pick<ModuleMetadata, 'imports'> &
  PartialModuleOptions & {
    global?: boolean;
  };

export type InstantiateOptions = Pick<ModuleOptions, 'connection' | 'storageOptions'>;

export type ModuleOptionsFactory = {
  createModuleOptions(): Promise<PartialModuleOptions> | PartialModuleOptions;
};

export type AsyncModuleOptions = Pick<ModuleMetadata, 'imports'> & {
  global?: boolean;
  useExisting?: Type<ModuleOptionsFactory>;
  useClass?: Type<ModuleOptionsFactory>;
  useFactory?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => Promise<PartialModuleOptions> | PartialModuleOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[];
  scope?: Scope;
};

export type GetAccountSasUrlResponse = {
  sasUrl: string;
  headers: Record<string, string | number>;
};

export type GetContainerSasUrlResponse = {
  sasUrl: string;
  headers: Record<string, string | number>;
};

export type GetBlockBlobSasUrlResponse = {
  sasUrl: string;
  headers: Record<string, string | number>;
};
