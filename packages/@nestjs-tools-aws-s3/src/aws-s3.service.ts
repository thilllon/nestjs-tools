import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

import { InjectAwsS3Options } from './aws-s3.decorator';
import type { ModuleOptions } from './aws-s3.interface';

@Injectable()
export class AwsS3Service extends S3Client {
  constructor(@InjectAwsS3Options() private readonly options: ModuleOptions) {
    super(options);
  }
}
