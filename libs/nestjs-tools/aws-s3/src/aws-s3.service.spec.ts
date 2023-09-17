import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as dotenv from 'dotenv';

import type { ModuleOptions, ModuleOptionsFactory } from './aws-s3.interface';
import { AwsS3Module } from './aws-s3.module';
import { AwsS3Service } from './aws-s3.service';
import { getClientToken } from './aws-s3.utils';

describe('AwsS3Service', () => {
  dotenv.config({ path: '.env.test' });

  @Injectable()
  class CorrectOptionsService implements ModuleOptionsFactory {
    createModuleOptions(): ModuleOptions | Promise<ModuleOptions> {
      return {
        credentials: {
          accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
          secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
        },
      };
    }
  }

  // @Injectable()
  // class IncorrectOptionsService implements ModuleOptionsFactory {
  //   createModuleOptions(): ModuleOptions {
  //     return {
  //       credentials: {
  //         accessKeyId: 'somthing_wrong_key',
  //         secretAccessKey: 'truly_wrong_secret',
  //       },
  //     };
  //   }
  // }

  describe('s3.service', () => {
    it('should provide the s3 client', async () => {
      const module = await Test.createTestingModule({
        imports: [
          AwsS3Module.registerAsync({
            useClass: CorrectOptionsService,
          }),
        ],
      }).compile();
      const service = module.get<AwsS3Service>(getClientToken());
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(AwsS3Service);
    });

    // it('fails to provide the s3 client', async () => {
    //   const module = await Test.createTestingModule({
    //     imports: [AwsS3Module.forRootAsync({ useClass: IncorrectOptionsService })],
    //   }).compile();
    //   const service = module.get<AwsS3Service>(getS3ClientToken());
    //   expect(service).toBeUndefined();
    // });
  });
});
