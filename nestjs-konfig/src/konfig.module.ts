import 'reflect-metadata';

import { DynamicModule, Module, OnApplicationBootstrap, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ZodSchema } from 'zod';

export interface ExtraModuleOptions {
  global?: boolean;
}

export class EnvVarNotFoundException extends Error {
  constructor(name: string) {
    super(`Environment variable not found: ${name}`);
  }
}

interface EnvParams {
  default?: string | number | boolean | object;
}

export function Env(key: string, params?: EnvParams) {
  const { default: defaultValue } = params || {};

  return (target: object, propertyName: string) => {
    const env = process.env[key];

    if (env === undefined && defaultValue === undefined) {
      throw new EnvVarNotFoundException(key);
    }

    const typeConstructor = Reflect.getMetadata('design:type', target, propertyName);

    Object.defineProperty(target, propertyName, {
      enumerable: true,
      configurable: false,
      value: env === undefined ? defaultValue : castValue(env, typeConstructor),
    });
  };
}

interface ProcessEnvParams {
  allowDuplicated?: boolean; // 다른 config와 겹쳐도 괜찮은지 여부
  process?: boolean; // process.env에 심기
  zod: ZodSchema;
}

export function ProcessEnv(key: string, params?: ProcessEnvParams) {
  return (target: object, propertyName: string) => {
    const env = process.env[key];
    const validated = params.zod.parse(env);

    // nestjs 에서 내부적으로 미리 세팅해둔 메타데이터로서, 해당 프로퍼티의 type construecto을 가져올 수 있다.
    const typeConstructor = Reflect.getMetadata('design:type', target, propertyName);

    Object.defineProperty(target, propertyName, {
      configurable: false, // prevent from deleting or changing
      value: env === undefined ? validated : castValue(env, typeConstructor),
    });
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
  envFilePath?: string[];
}

@Module({})
export class KonfigModule implements OnApplicationBootstrap {
  static forRoot(options: ModuleOptions, extras?: ExtraModuleOptions): DynamicModule {
    // TODO: 여기서 dotenv를 불러주면될듯
    // 이거는 @nestjs/config를 밴치마킹하면 어떨까

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

  onApplicationBootstrap() {
    // 여기서 모든 임시 변수 정리
    // process.env.
  }
}
