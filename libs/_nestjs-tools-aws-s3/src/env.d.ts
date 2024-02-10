/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
declare module NodeJS {
  interface ProcessEnv {
    AWS_S3_ACCESS_KEY: string;
    AWS_S3_SECRET_ACCESS_KEY: string;
  }
}
