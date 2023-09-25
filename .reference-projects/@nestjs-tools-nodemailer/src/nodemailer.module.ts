import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';

import {
  AsyncModuleOptions,
  ExtraModuleOptions,
  ModuleOptions,
  ModuleOptionsFactory,
} from './nodemailer.interface';
import { getClientToken, getOptionsToken } from './nodemailer.utils';

@Module({})
export class NodemailerModule {
  static register(options: ModuleOptions, extras?: ExtraModuleOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: getOptionsToken(extras?.alias),
      useValue: options,
    };

    const clientProvider: Provider = {
      provide: getClientToken(extras?.alias),
      useValue: this.createClient(options),
    };

    return {
      module: NodemailerModule,
      // FIXME: optionsProvider does not need to be exported...?
      providers: [optionsProvider, clientProvider],
      exports: [optionsProvider, clientProvider],
      global: extras?.global,
    };
  }

  static registerAsync(options: AsyncModuleOptions, extras?: ExtraModuleOptions): DynamicModule {
    const clientProvider: Provider = {
      provide: getClientToken(extras?.alias),
      useFactory: (options: ModuleOptions) => this.createClient(options),
      inject: [getOptionsToken(extras?.alias)],
    };

    return {
      module: NodemailerModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options, extras), clientProvider],
      exports: [clientProvider],
      global: extras?.global,
    };
  }

  private static createAsyncProviders(
    options: AsyncModuleOptions,
    extras?: ExtraModuleOptions,
  ): Provider[] {
    if (options.useClass) {
      return [
        { provide: options.useClass, useClass: options.useClass },
        this.createAsyncOptionsProvider(options, extras),
      ];
    }

    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options, extras)];
    }

    throw new Error(
      'Invalid configuration. One of useClass, useExisting or useFactory must be defined.',
    );
  }

  private static createAsyncOptionsProvider(
    options: AsyncModuleOptions,
    extras?: ExtraModuleOptions,
  ): Provider {
    if (options.useClass || options.useExisting) {
      return {
        provide: getOptionsToken(extras?.alias),
        async useFactory(optionsFactory: ModuleOptionsFactory): Promise<ModuleOptions> {
          return optionsFactory.createModuleOptions();
        },
        inject: [options.useClass || options.useExisting] as Type<ModuleOptionsFactory>[],
      };
    }

    if (options.useFactory) {
      return {
        provide: getOptionsToken(extras?.alias),
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    throw new Error(
      'Invalid configuration. One of useClass, useExisting or useFactory must be defined.',
    );
  }

  private static createClient(options: ModuleOptions): Transporter<any> {
    return createTransport(options.transport, options.defaults);
  }
}