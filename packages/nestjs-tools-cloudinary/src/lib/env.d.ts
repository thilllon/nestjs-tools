declare module NodeJS {
	interface ProcessEnv {
		CLOUDINARY_API_KEY: string;
		CLOUDINARY_API_SECRET: string;
		CLOUDINARY_CLOUD_NAME: string;
	}
}
