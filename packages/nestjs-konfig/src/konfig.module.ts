import 'reflect-metadata';

import { DynamicModule, Injectable, Logger, Module, OnApplicationBootstrap, Provider } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { ZodSchema, z } from 'zod';

export interface ExtraModuleOptions {
  global?: boolean;
}

export class EnvVarNotFoundException extends Error {
  constructor(name: string) {
    super(`Environment variable not found: ${name}`);
  }
}

// interface EnvParams {
//   default?: string | number | boolean | object;
// }

// export function Env(key: string, params?: EnvParams) {
//   const { default: defaultValue } = params || {};

//   return (target: object, propertyName: string) => {
//     const env = process.env[key];

//     if (env === undefined && defaultValue === undefined) {
//       throw new EnvVarNotFoundException(key);
//     }

//     const typeConstructor = Reflect.getMetadata('design:type', target, propertyName);

//     Object.defineProperty(target, propertyName, {
//       enumerable: true,
//       configurable: false,
//       value: env === undefined ? defaultValue : castValue(env, typeConstructor),
//     });
//   };
// }

type Validator = {
  parse: (value: string) => any;
};

interface ProcessEnvParams {
  process?: boolean; // process.env에 심기. 기본값은 true
  // validate?: ZodSchema;
  validate?: Validator;
}

export function ProcessEnv(key: string, params?: ProcessEnvParams) {
  return (target: object, propertyName: string) => {
    const envValue = process.env[key];
    // nestjs 에서 내부적으로 미리 세팅해둔 메타데이터로서, 해당 프로퍼티의 type construecto을 가져올 수 있다.
    const typeConstructor = Reflect.getMetadata('design:type', target, propertyName);
    const value = params?.validate?.parse(envValue ?? castValue(envValue, typeConstructor)) ?? envValue;
    // falsy `configurable` option prevents from deleting or changing
    Object.defineProperty(target, propertyName, { value, configurable: false });

    if (params.process ?? true) {
      process.env[key] = value;
    }

    process.env[`konfig::${(target as any).name}::${key}`] = value;
  };
}

function castValue(value: string | undefined, targetConstructor: any) {
  if (targetConstructor === Object) {
    return JSON.parse(value);
  }
  if (targetConstructor === Boolean) {
    return value === 'true';
  }
  return targetConstructor(value);
}

interface ModuleOptions {
  envFilePaths?: string[];
  overwrite?: boolean; // 여러개의 env파일이 있을때, 덮어쓸지 여부
  allowDuplicated?: boolean; // 다른 config와 겹쳐도 괜찮은지 여부
}

@Module({})
export class KonfigModule implements OnApplicationBootstrap {
  private static allowDuplicated: boolean;

  static forRoot(options: ModuleOptions, extras?: ExtraModuleOptions): DynamicModule {
    this.loadEnvFile(options.envFilePaths);
    this.allowDuplicated = options.allowDuplicated;

    return {
      module: KonfigModule,
      global: extras?.global,
    };
  }

  static forFeature(providers: Provider[]): DynamicModule {
    return {
      module: KonfigModule,
      providers,
      exports: providers,
    };
  }

  private static loadEnvFile(envFilePaths?: string[], verbose?: boolean): Record<string, any> {
    envFilePaths = envFilePaths ?? [resolve(process.cwd(), '.env')];

    let config: ReturnType<typeof dotenv.parse> = {};

    for (const envFilePath of envFilePaths) {
      if (existsSync(envFilePath)) {
        if (verbose) {
          Logger.log(`[KonfigModule] Loading environment variables from ${envFilePath}`);
        }
        config = Object.assign(dotenv.parse(readFileSync(envFilePath)), config);
        break; // 이걸뺄까말까??
      }
    }
    return config;
  }

  onApplicationBootstrap() {
    if (!KonfigModule.allowDuplicated) {
      Object.keys(process.env)
        .filter((key) => key.startsWith('konfig::')) // konfig::DatabaseConfig::DB_HOST
        .map((key) => {
          delete process.env[key]; // clean up
          return key.split('::');
        })
        .map((splitted, index, array) => ({
          env: splitted[2],
          configNames: array.filter((_, idx) => idx !== index).flatMap((val) => (val[2] === splitted[2] ? val[1] : [])),
        }))
        .filter(({ configNames }) => configNames.length > 1)
        .forEach(({ env, configNames }) => {
          throw new Error(`Duplicated environment variable found: ${env} in ${configNames.join(', ')}`);
        });
    }
  }
}

@Injectable()
export class DatabaseConfig {
  @ProcessEnv('DATABASE_HOST', {
    process: false,
    validate: z.string().default('localhost'),
  })
  host: string;

  @ProcessEnv('DATABASE_PORT', {
    process: false,
    validate: z.number().default(3306),
  })
  port: number;
}

// KonfigModule.forFeature([DatabaseConfig]);
