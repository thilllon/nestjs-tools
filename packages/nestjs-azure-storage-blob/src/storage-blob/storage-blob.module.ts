import { BlobServiceClient } from '@azure/storage-blob';
import { DynamicModule, Global, Module, Provider, Scope, Type } from '@nestjs/common';
import {
  MODULE_CLIENT_TOKEN,
  MODULE_CONNECTION_VARIABLE_TOKEN,
  MODULE_OPTIONS_TOKEN,
} from './storage-blob.constants';
import {
  AsyncModuleOptions,
  InstantiateOptions,
  ModuleOptions,
  ModuleOptionsFactory,
} from './storage-blob.interface';
import { StorageBlobService } from './storage-blob.service';

@Global()
@Module({
  providers: [StorageBlobService],
  exports: [StorageBlobService],
})
export class StorageBlobModule {
  static register(options: ModuleOptions): DynamicModule {
    return {
      global: options.global ?? false,
      module: StorageBlobModule,
      imports: options.imports,
      providers: [
        {
          provide: MODULE_CLIENT_TOKEN,
          scope: options.scope ?? Scope.DEFAULT,
          useValue: this.instantiate(options),
        },
      ],
    };
  }

  static registerAsync(options: AsyncModuleOptions): DynamicModule {
    const provider: Provider = {
      provide: MODULE_CLIENT_TOKEN,
      useFactory: (options: InstantiateOptions) => this.instantiate(options),
      scope: options.scope ?? Scope.DEFAULT,
      inject: [MODULE_OPTIONS_TOKEN],
    };

    return {
      global: options.global,
      imports: options.imports,
      module: StorageBlobModule,
      providers: [...this.createAsyncProviders(options), provider],
    };
  }

  private static createAsyncProviders(optionsAsync: AsyncModuleOptions): Provider[] {
    if (optionsAsync.useExisting || optionsAsync.useFactory) {
      return [this.createAsyncOptionsProvider(optionsAsync)];
    }

    if (optionsAsync.useClass) {
      return [
        { provide: optionsAsync.useClass, useClass: optionsAsync.useClass },
        this.createAsyncOptionsProvider(optionsAsync),
      ];
    }

    throw new Error('One of useClass, useFactory or useExisting should be provided');
  }

  private static createAsyncOptionsProvider(options: AsyncModuleOptions): Provider {
    if (options.useFactory) {
      return {
        provide: MODULE_OPTIONS_TOKEN,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      };
    }

    return {
      provide: MODULE_OPTIONS_TOKEN,
      useFactory: (optionsFactory: ModuleOptionsFactory) => optionsFactory.createModuleOptions(),
      inject: [(options.useClass ?? options.useExisting) as Type<ModuleOptionsFactory>],
    };
  }

  private static instantiate(options: InstantiateOptions): BlobServiceClient {
    if (!options.connection) {
      throw new Error(`Environment variable is required: "${MODULE_CONNECTION_VARIABLE_TOKEN}"`);
    }

    return BlobServiceClient.fromConnectionString(options.connection, options.storageOptions);
  }
}
