import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as dotenv from 'dotenv';

import { InjectAwsS3Client } from './aws-s3.decorator';
import { AwsS3Module } from './aws-s3.module';

describe('InjectS3', () => {
  dotenv.config({ path: '.env.test' });

  @Injectable()
  class FooService {
    constructor(@InjectAwsS3Client() private s3Client: S3Client) {}

    get s3() {
      return this.s3Client;
    }
  }

  @Injectable()
  class BarService {
    constructor(
      @InjectAwsS3Client('first') private firstS3: S3Client,
      @InjectAwsS3Client('second') private secondS3: S3Client,
    ) {}

    getFirst() {
      return this.firstS3;
    }

    getSecond() {
      return this.secondS3;
    }
  }

  let module: TestingModule;
  let fooService: FooService;
  let barService: BarService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        AwsS3Module.register({
          credentials: {
            accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
          },
        }),
      ],
      providers: [FooService, BarService],
    }).compile();
    fooService = module.get(FooService);
    barService = module.get(BarService);
  });

  describe('when decorating a class constructor parameter', () => {
    test('should inject the s3 client', () => {
      expect(fooService.s3).toBeInstanceOf(S3Client);
    });
  });

  describe('when decorator has alias', () => {
    test('should inject the s3 client', async () => {
      expect(barService.getFirst()).toBeInstanceOf(S3Client);
      expect(barService.getSecond()).toBeInstanceOf(S3Client);
      expect(barService.getFirst()).not.toBe(barService.getSecond());
      expect(barService.getFirst().config).toEqual(barService.getSecond().config);
    });
  });
});
