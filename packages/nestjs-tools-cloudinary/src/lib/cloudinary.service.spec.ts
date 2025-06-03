import { Test } from '@nestjs/testing';
import { ConfigOptions } from 'cloudinary';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { MODULE_OPTIONS_TOKEN } from './cloudinary.module-definition';
import { CloudinaryService } from './cloudinary.service';

dotenv.config({ path: path.join(__dirname, '../../.env.test') });

jest.setTimeout(30000);

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CloudinaryService,
        {
          provide: MODULE_OPTIONS_TOKEN,
          useValue: {
            api_key: process.env.CLOUDINARY_API_KEY as string,
            api_secret: process.env.CLOUDINARY_API_SECRET as string,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
          } as ConfigOptions,
        },
      ],
    }).compile();

    service = module.get(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  it('createSignedUploadUrl', async () => {
    const response = await service.createSignedUploadUrl({
      public_id: 'foo',
      resource_type: 'image',
      folder: 'my-folder',
      eager: 'eager',
    });
    expect(response).toEqual({
      api_key: process.env.CLOUDINARY_API_KEY,
      public_id: 'foo',
      resource_type: 'image',
      folder: 'my-folder',
      eager: 'eager',
      signature: expect.any(String),
      timestamp: expect.any(String),
      url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    });
  });
});
