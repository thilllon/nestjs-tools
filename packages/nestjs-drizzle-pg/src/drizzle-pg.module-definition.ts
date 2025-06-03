import { ConfigurableModuleBuilder } from "@nestjs/common";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Client, Pool } from "pg";
import {
	defaultTokenAlias,
	type DrizzlePgModuleExtras,
	type DrizzlePgModuleOptions,
	getDrizzlePgToken,
	getPgConnectionToken,
} from "./drizzle-pg.interface";

export const {
	ConfigurableModuleClass,
	MODULE_OPTIONS_TOKEN,
	ASYNC_OPTIONS_TYPE,
	OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<DrizzlePgModuleOptions>()
	.setExtras<DrizzlePgModuleExtras>(
		{ alias: defaultTokenAlias, isGlobal: false },
		(definition, extras) => {
			const connectionToken = getPgConnectionToken(extras.alias);
			const drizzleToken = getDrizzlePgToken(extras.alias);

			definition.providers ??= [];
			definition.exports ??= [];

			definition.providers.push(
				{
					provide: connectionToken,
					inject: [MODULE_OPTIONS_TOKEN],
					useFactory: async (options: DrizzlePgModuleOptions) => {
						if (options.pgConfig?.type === "pool") {
							const pool = new Pool(options.pgConfig.config);
							await pool.connect();
							return pool;
						}
						const client = new Client(options.pgConfig?.config);
						await client.connect();
						return client;
					},
				},
				{
					provide: drizzleToken,
					inject: [MODULE_OPTIONS_TOKEN, connectionToken],
					useFactory: (
						options: DrizzlePgModuleOptions,
						connection: Pool | Client,
					): NodePgDatabase<Record<string, never>> => {
						return drizzle(connection, options.drizzleConfig ?? {});
					},
				},
			);

			definition.exports.push(drizzleToken);

			definition.global = extras.isGlobal;

			return definition;
		},
	)
	.build();
