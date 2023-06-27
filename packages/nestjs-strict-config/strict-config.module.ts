import { DynamicModule, Injectable, Module, Provider, Type } from '@nestjs/common';
import { ConfigGetOptions, ConfigService, NoInferType, Path, PathValue } from '@nestjs/config';
import { Octokit } from 'octokit';

// import { MODULE_OPTIONS_TOKEN, MODULE_CLIENT_TOKEN } from './octokit.constants';
import { AsyncModuleOptions, ExtraModuleOptions, ModuleOptions, ModuleOptionsFactory } from './strict-config.interface';

abstract class AbstractConfigService {}

@Injectable()
export class StrictConfigService extends ConfigService {
  constructor() {
    super();
  }

  get<T = any>(propertyPath: string): T | undefined {
    return super.get(propertyPath);
  }

  // get<T = Record<string, unknown>, P extends Path<T> = any, R = PathValue<T, P>>(
  //   propertyPath: P,
  //   options: ConfigGetOptions,
  // ): R | undefined {
  //   return super.get(propertyPath, options);
  // }

  // get<T = any>(propertyPath: string, defaultValue: NoInferType<T>): T {
  //   return super.get(propertyPath, defaultValue);
  // }

  // get<T = Record<string, unknown>, P extends Path<T> = any, R = PathValue<T, P>>(
  //   propertyPath: P,
  //   defaultValue: NoInferType<R>,
  //   options: ConfigGetOptions,
  // ): R {
  //   // return super.get(propertyPath, defaultValue, options);
  // }

  // get(propertyPath: unknown, defaultValue?: unknown, options?: unknown): T | R | T | R | undefined {
  //   return super.get(propertyPath, defaultValue, options);
  // }
}

@Module({
  providers: [],
})
export class StrictConfigModule {
  static forFeature(options: ModuleOptions, extras?: ExtraModuleOptions): DynamicModule {
    const providers: Provider[] = options.map((option) => this.createConfig(option));

    return {
      module: StrictConfigModule,
      providers,
      global: extras?.global,
    };
  }

  private static createConfig(configService: any): Provider {
    return {
      provide: configService,
      useFactory: (configService) => {
        return {
          //
        };
      },
    };
  }

  // static registerAsync(options: AsyncModuleOptions, extras?: ExtraModuleOptions): DynamicModule {
  //   const clientProvider: Provider = {
  //     provide: MODULE_CLIENT_TOKEN,
  //     useFactory: (options: ModuleOptions) => this.createClient(options),
  //     inject: [MODULE_OPTIONS_TOKEN],
  //     scope: extras?.scope,
  //   };

  //   return {
  //     global: extras?.global,
  //     imports: options.imports || [],
  //     module: StrictConfigModule,
  //     providers: [...this.createAsyncProviders(options, extras), clientProvider],
  //   };
  // }
}
