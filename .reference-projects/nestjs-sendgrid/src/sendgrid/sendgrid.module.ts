import { DynamicModule, Module, Provider, Scope, Type } from '@nestjs/common';
import type { Client } from '@sendgrid/client';
import * as client from '@sendgrid/client';
import { MODULE_CLIENT_TOKEN, MODULE_OPTIONS_TOKEN, SENDGRID_API_KEY } from './sendgrid.constants';
import {
  AsyncModuleOptions,
  ExtraModuleOptions,
  ModuleOptions,
  ModuleOptionsFactory,
} from './sendgrid.interface';
import { SendgridService } from './sendgrid.service';
import { getOptionsToken } from './sendgrid.utils';

@Module({
  providers: [SendgridService],
  exports: [SendgridService],
})
export class SendgridModule {
  static register(options: ModuleOptions, extras?: ExtraModuleOptions): DynamicModule {
    const clientProvider: Provider = {
      provide: MODULE_CLIENT_TOKEN,
      scope: extras?.scope ?? Scope.DEFAULT,
      useValue: this.createClient(options),
    };

    return {
      module: SendgridModule,
      providers: [clientProvider],
      exports: [clientProvider],
      global: extras?.global,
    };
  }

  static registerAsync(options: AsyncModuleOptions, extras?: ExtraModuleOptions): DynamicModule {
    const provider: Provider = {
      useFactory: (options: ModuleOptions) => this.createClient(options),
      provide: getOptionsToken(extras?.alias),
      scope: extras?.scope,
      inject: [MODULE_OPTIONS_TOKEN],
    };

    return {
      imports: options.imports,
      module: SendgridModule,
      providers: [...this.createAsyncProviders(options, extras), provider],
      global: extras?.global,
    };
  }

  private static createAsyncProviders(
    options: AsyncModuleOptions,
    extras?: ExtraModuleOptions
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
      'Invalid configuration. One of useClass, useExisting or useFactory must be defined.'
    );
  }

  private static createAsyncOptionsProvider(
    options: AsyncModuleOptions,
    extras?: ExtraModuleOptions
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
        inject: options.inject,
      };
    }

    throw new Error(
      'Invalid configuration. One of useClass, useExisting or useFactory must be defined.'
    );
  }

  private static createClient(options: ModuleOptions): Client {
    const apiKey = options.apiKey ?? process.env[SENDGRID_API_KEY];
    if (!apiKey) {
      throw new Error(`Environment variable is required: "${SENDGRID_API_KEY}"`);
    }

    const defaultClient: Client = client;
    defaultClient.setApiKey(apiKey);
    return defaultClient;
  }
}
