import { beforeAll, describe, expect, test } from '@jest/globals';
import { Inject, Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ClassConstructor } from 'class-transformer';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as z from 'zod';

// export type DatabaseEnv = z.infer<typeof databaseEnv>;

type StrictConfigOptions = {
  env?: string;
  zod?: z.ZodType;
};

// 맴버 변수들에 대해서 reflect metadata를 사용해서 zod validator를 세팅한다.
// 여 기서는 따로 로직을 수행하지 않는다. 모든 로직은 StrictConfigModule에서 앱 구동시 처음 한번만 수행한다.
// 문제는validator가 메모리에 계쏙 올라가있을거같은데... 어떻게 없애나.구동할때만 zod를 쓰고 버리고싶은데...
function StrictConfig(options?: StrictConfigOptions) {
  return function MethodDecorator(prototype: any, name: string, descriptor?: PropertyDescriptor) {
    console.log('prototype', prototype);
    console.log('key', name);
    console.log('desc', descriptor);
  };
}

function StrictConfigService() {
  return function ClassDecorator(constructor: ClassConstructor<any>) {
    // const method = constructor.prototype.method; // 기존의 method
    // // 기존의 method를 재정의 한다.
    // constructor.prototype.mtehod = function (e: string) {
    //   method(e); // 기존의 method를 호출하고, 아래를 추가한다.
    //   console.log('d()를 호출하면 이것도 호출된다!');
    // };
  };
}

const zBoolean = z
  .string()
  .or(z.boolean())
  .transform((t) => String(t) === 'true');

const booleanString = (str: unknown) => String(str) === 'true';

@StrictConfigService()
@Injectable()
export class DatabaseConfigService {
  @StrictConfig({
    env: 'DATABASE_URL',
    zod: z.string().default('postgres://postgres:postgres@localhost:9432/pronance?schema=public'),
  })
  url!: PostgresConnectionOptions['url'];

  @StrictConfig({
    env: 'DATABASE_SYNCHRONIZE',
    zod: z.custom<boolean>(booleanString).default(false),
  })
  synchronize!: PostgresConnectionOptions['synchronize'];

  @StrictConfig({
    env: 'TYPEORM_LOGGING',
    zod: z.custom<boolean>(booleanString).default(false),
  })
  logging!: boolean;

  @StrictConfig({
    zod: z.custom<PostgresConnectionOptions['type']>((a) => a).default('postgres'),
  })
  type!: PostgresConnectionOptions['type'];

  @StrictConfig({
    zod: z.custom<PostgresConnectionOptions['logger']>((a) => a).default('advanced-console'),
  })
  logger!: PostgresConnectionOptions['logger'];

  @StrictConfig({
    zod: z.boolean().default(true),
  })
  autoLoadEntities!: TypeOrmModuleOptions['autoLoadEntities'];

  @StrictConfig({
    zod: z.custom<boolean>(booleanString).default(false),
  })
  bigNumberStrings!: boolean;

  @StrictConfig({
    zod: z.custom<boolean>(booleanString).default(false),
  })
  dateStrings!: boolean;
}

/**
 * Apollo Service
 */
@Injectable()
export class HelloService {
  constructor(@Inject() private readonly apolloStudioConfigService: DatabaseConfigService) {}

  async getConfig() {
    // this.apolloStudioConfigService.APOLLO_GRAPH_REF;
  }
}

/**
 * Apollo Module
 */
@Module({
  providers: [HelloService, DatabaseConfigService],
  exports: [HelloService],
})
export class HelloModule {}

// --------------------------------
// --------------------------------

describe('nestjs-strict-config', () => {
  let configService: ConfigService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [HelloModule],
      imports: [
        ConfigModule.forRoot({
          load: [() => ({})],
          isGlobal: true,
          validate: (config) => {
            return config;
          },
          // validationSchema, // joi
          validationOptions: {},
        }),
      ],
    }).compile();
    configService = module.get(ConfigService);
  });

  test('어떤식으로 동작하길 바라는지 테스트 코드로 작성', async () => {
    expect(true).toBe(true);
  });
});
