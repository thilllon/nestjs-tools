import type { DrizzleConfig } from "drizzle-orm";
import type { ClientConfig, PoolConfig } from "pg";

export interface DrizzlePgModuleOptions {
	drizzleConfig?: DrizzleConfig;
	pgConfig?:
		| { type: "pool"; config: PoolConfig }
		| { type: "client"; config: ClientConfig };
}

export type DrizzlePgModuleExtras = {
	alias?: string;
	isGlobal?: boolean;
};

export const defaultTokenAlias = "default";

export const getDrizzlePgToken = (name = defaultTokenAlias): string =>
	`DRIZZLE_PG_${name}`;

export const getPgConnectionToken = (name = defaultTokenAlias): string =>
	`DRIZZLE_PG_CONNECTION_${name}`;
