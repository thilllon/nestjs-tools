declare module NodeJS {
	interface ProcessEnv {
		NESTJS_STORAGE_BLOB_CONNECTION: string;
		NESTJS_STORAGE_BLOB_CONTAINER: string;
	}
}
