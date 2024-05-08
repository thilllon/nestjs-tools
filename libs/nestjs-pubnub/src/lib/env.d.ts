declare module NodeJS {
  interface ProcessEnv {
    PUBNUB_PUBLISH_KEY: string;
    PUBNUB_SUBSCRIBE_KEY: string;
    PUBNUB_SECRET_KEY: string;
  }
}
