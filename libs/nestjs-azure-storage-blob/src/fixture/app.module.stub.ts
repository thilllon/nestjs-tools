import { Module } from '@nestjs/common';
import { AzureStorageBlobModule } from '../lib';
import { AppController } from './app.controller.stub';

@Module({
  imports: [
    AzureStorageBlobModule.registerAsync({
      useFactory: () => ({ connection: process.env.NESTJS_STORAGE_BLOB_CONNECTION ?? '' }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
