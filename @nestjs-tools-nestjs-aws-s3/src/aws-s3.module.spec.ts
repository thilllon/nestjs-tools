import { S3Client } from '@aws-sdk/client-s3';
import { describe, expect, it } from '@jest/globals';
import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as dotenv from 'dotenv';

import { ModuleOptions, ModuleOptionsFactory } from './aws-s3.interface';
import { AwsS3Module } from './aws-s3.module';
import { getClientToken } from './aws-s3.utils';

describe('S3Module', () => {
  dotenv.config({ path: '.env.test' });
  const accessKeyId = process.env.AWS_S3_ACCESS_KEY as string;
  const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY as string;

  @Injectable()
  class FooService implements ModuleOptionsFactory {
    createModuleOptions(): ModuleOptions {
      return { credentials: { accessKeyId, secretAccessKey } };
    }
  }

  describe('forRoot', () => {
    it('should provide s3 client', async () => {
      const module = await Test.createTestingModule({
        imports: [AwsS3Module.register({ credentials: { accessKeyId, secretAccessKey } }, { global: false })],
      }).compile();

      const service = module.get<S3Client>(getClientToken());
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(S3Client);
    });
  });

  describe('forRootAsync', () => {
    describe('when `useFactory` option is used', () => {
      it('should provide s3 client', async () => {
        @Injectable()
        class ConfigService {
          _accessKeyId: string;
          _secretAccessKey: string;

          constructor() {
            this._accessKeyId = accessKeyId;
            this._secretAccessKey = secretAccessKey;
          }
        }

        const module = await Test.createTestingModule({
          imports: [
            AwsS3Module.registerAsync(
              {
                inject: [ConfigService],
                useFactory: async (configService) => ({
                  credentials: {
                    accessKeyId: configService._acessToken,
                    secretAccessKey: configService._secretAccessKey,
                  },
                }),
              },
              { alias: 'hello' }
            ),
          ],
          providers: [ConfigService],
        }).compile();

        const s3Client = module.get<S3Client>(getClientToken('hello'));
        expect(s3Client).toBeDefined();
        expect(s3Client).toBeInstanceOf(S3Client);

        // const invalidS3Client = module.get<S3Client>(getClientToken());
        // expect(invalidS3Client).toBeUndefined();
      });
    });

    describe('when `useClass` option is used', () => {
      it('should provide s3 client', async () => {
        const module = await Test.createTestingModule({
          imports: [AwsS3Module.registerAsync({ useClass: FooService }, { alias: 'hello' })],
        }).compile();

        const s3Client = module.get<S3Client>(getClientToken('hello'));
        expect(s3Client).toBeDefined();
        expect(s3Client).toBeInstanceOf(S3Client);

        // expect(module.get<S3Client>(getClientToken('goodbye'))).toThrow();

        try {
          const client = module.get<S3Client>(getClientToken());
        } catch (err) {
          console.error(err);
          expect(err).toBeDefined();
        }
      });
    });

    describe('when `useExisting` option is used', () => {
      it('should provide s3 client', async () => {
        // TODO: useExisting
      });
    });
  });
});
