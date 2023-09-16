import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { Octokit } from 'octokit';

import { MODULE_CLIENT_TOKEN, MODULE_OPTIONS_TOKEN } from './octokit.constants';
import {
  AsyncModuleOptions,
  ExtraModuleOptions,
  ModuleOptions,
  ModuleOptionsFactory,
} from './octokit.interface';

@Module({})
export class OctokitModule {
  static register(options: ModuleOptions, extras?: ExtraModuleOptions): DynamicModule {
    return {
      module: OctokitModule,
      providers: [
        {
          provide: MODULE_CLIENT_TOKEN,
          useValue: this.createClient(options),
          scope: extras?.scope,
        },
      ],
      global: extras?.global,
    };
  }

  static registerAsync(options: AsyncModuleOptions, extras?: ExtraModuleOptions): DynamicModule {
    const clientProvider: Provider = {
      provide: MODULE_CLIENT_TOKEN,
      useFactory: (options: ModuleOptions) => this.createClient(options),
      inject: [MODULE_OPTIONS_TOKEN],
      scope: extras?.scope,
    };

    return {
      global: extras?.global,
      imports: options.imports || [],
      module: OctokitModule,
      providers: [...this.createAsyncProviders(options, extras), clientProvider],
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
        provide: MODULE_OPTIONS_TOKEN,
        async useFactory(optionsFactory: ModuleOptionsFactory): Promise<ModuleOptions> {
          return optionsFactory.createModuleOptions();
        },
        inject: [options.useClass || options.useExisting] as Type<ModuleOptionsFactory>[],
        scope: extras?.scope,
      };
    }

    if (options.useFactory) {
      return {
        provide: MODULE_OPTIONS_TOKEN,
        useFactory: options.useFactory,
        inject: options.inject,
        scope: extras?.scope,
      };
    }

    throw new Error(
      'Invalid configuration. One of useClass, useExisting or useFactory must be defined.',
    );
  }

  private static createClient(options: ModuleOptions): Octokit {
    let _Octokit = Octokit;
    if (options.plugins) {
      _Octokit = _Octokit.plugin(...options.plugins);
    }
    const instanceOptions: ModuleOptions['options'] = {
      ...options.options,
    };
    if (typeof instanceOptions?.auth === 'function') {
      instanceOptions.auth = instanceOptions.auth();
    }
    return new _Octokit(instanceOptions);
  }
}
