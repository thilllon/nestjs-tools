import {
  DynamicModule,
  Inject,
  Injectable,
  Module,
  ModuleMetadata,
  OnModuleDestroy,
  Type,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ConnectionConfig } from 'pg';
import createPostgresSubscriber, { Options as PgListenOptions, Subscriber } from 'pg-listen';

export const MODULE_CONNECTION_TOKEN = 'PG_LISTEN_MODULE_CONNECTION_TOKEN';
export const MODULE_OPTIONS_TOKEN = 'PG_LISTEN_MODULE_OPTIONS_TOKEN';

// https://github.com/jkcorrea/nestjs-pg-pubsub

export const InjectPgSubscriber = (): ParameterDecorator => Inject(MODULE_CONNECTION_TOKEN);

@Injectable()
export class PgListenService {
  private _pgSubscriber: PgSubscriber;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) private readonly options: ModuleOptions) {
    const { listenOptions: opts, ...connectionConfig } = this.options;
    this._pgSubscriber = createPostgresSubscriber(connectionConfig, opts);
    this._pgSubscriber.connect();
  }

  getPgSubscriber(): PgSubscriber {
    return this._pgSubscriber;
  }
}

export interface ModuleOptions extends ConnectionConfig {
  listenOptions?: PgListenOptions;
}

export interface ModuleOptionsFactory {
  createModuleOptions(alias?: string): Promise<ModuleOptions> | ModuleOptions;
}

export interface PgPubSubAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<ModuleOptionsFactory>;
  useClass?: Type<ModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<ModuleOptions> | ModuleOptions;
  inject?: any[];
}

export type PgSubscriber = Subscriber;

@Module({})
export class PgListenModule implements OnModuleDestroy {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private readonly options: ModuleOptions,
    private readonly moduleRef: ModuleRef,
  ) {}

  static register(options: ModuleOptions): DynamicModule {
    const connectionProvider = {
      provide: MODULE_CONNECTION_TOKEN,
      useFactory: (service: PgListenService): PgSubscriber => {
        return service.getPgSubscriber();
      },
      inject: [PgListenService],
    };
    return {
      module: PgListenModule,
      providers: [{ provide: MODULE_OPTIONS_TOKEN, useValue: options }, connectionProvider],
    };
  }

  static registerAsync(options: PgPubSubAsyncOptions): DynamicModule {
    const connectionProvider = {
      provide: MODULE_CONNECTION_TOKEN,
      useFactory: (service: PgListenService): PgSubscriber => {
        return service.getPgSubscriber();
      },
      inject: [PgListenService],
    };

    return {
      module: PgListenModule,
      providers: [...this.createAsyncProviders(options), connectionProvider],
      imports: options.imports || [],
      // global: options.global || false,
    };
  }

  private static createAsyncOptionsProvider(options: PgPubSubAsyncOptions) {
    if (options.useFactory) {
      return {
        provide: MODULE_OPTIONS_TOKEN,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: MODULE_OPTIONS_TOKEN,
      useFactory: async (optionsFactory: ModuleOptionsFactory) =>
        await optionsFactory.createModuleOptions(),
      inject: [options.useExisting || options.useClass] as Type<ModuleOptionsFactory>[],
    };
  }

  private static createAsyncProviders(options: PgPubSubAsyncOptions) {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass as Type<ModuleOptionsFactory>,
        useClass: options.useClass as Type<ModuleOptionsFactory>,
      },
    ];
  }

  onModuleDestroy(): void {
    if (!this.options.keepAlive) {
      const pgSubscriber = this.moduleRef.get<PgSubscriber>(MODULE_CONNECTION_TOKEN);
      pgSubscriber.close();
    }
  }
}
