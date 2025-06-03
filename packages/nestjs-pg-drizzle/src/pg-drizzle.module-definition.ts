import { ConfigurableModuleBuilder } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DrizzleModuleExtras, DrizzleModuleOptions, getConnectionToken, getDbToken } from './pg-drizzle.interface';
import { Pool, Client } from 'pg';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, ASYNC_OPTIONS_TYPE, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<DrizzleModuleOptions>()
    .setExtras<DrizzleModuleExtras>({ name: 'default', isGlobal: false }, (definition, extras) => {
      const name = extras.name || 'default';
      const connectionToken = getConnectionToken(name);
      const dbToken = getDbToken(name);

      definition.providers ??= [];
      definition.exports ??= [];

      definition.providers.push(
        {
          provide: connectionToken,
          inject: [MODULE_OPTIONS_TOKEN],
          useFactory: async (options: DrizzleModuleOptions) => {
            if (options.pgConfig?.type === 'client') {
              const client = new Client(options.pgConfig.config);
              await client.connect();
              return client;
            } else {
              return new Pool(options.pgConfig?.config);
            }
          },
        },
        {
          provide: dbToken,
          useFactory: async (options: DrizzleModuleOptions, connection) => {
            return drizzle(connection, {
              schema: options.drizzleConfig?.schema,
            });
          },
          inject: [MODULE_OPTIONS_TOKEN, connectionToken],
        }
      );

      definition.exports.push(dbToken);

      definition.global = extras.isGlobal;

      return definition;
    })
    .build();
