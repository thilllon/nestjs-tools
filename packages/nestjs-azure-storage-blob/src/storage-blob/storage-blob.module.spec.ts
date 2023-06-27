import { BlobServiceClient } from '@azure/storage-blob';
import { beforeEach, describe, expect, test } from '@jest/globals';
import { Test } from '@nestjs/testing';
import * as dotenv from 'dotenv';
import { StorageBlobModule } from './storage-blob.module';
import { StorageBlobService } from './storage-blob.service';

dotenv.config({ path: '.env.test' });

describe('initialize StorageBlobModule using `forRoot`', () => {
  let service: StorageBlobService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        StorageBlobModule.register({
          connection: process.env.NEST_STORAGE_BLOB_CONNECTION,
        }),
      ],
    }).compile();

    service = module.get<StorageBlobService>(StorageBlobService);
  });

  test('should be defined', async () => {
    expect(module).toBeDefined();
    expect(service).toBeInstanceOf(StorageBlobService);

    expect(service).toBeTruthy();
    expect(service.deleteFile).toBeTruthy();
    expect(service.getClient()).toBeInstanceOf(BlobServiceClient);
  });
});

describe('global StorageBlobModule', () => {
  let service: StorageBlobService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        StorageBlobModule.registerAsync({
          useFactory: () => ({
            connection: process.env.NEST_STORAGE_BLOB_CONNECTION,
          }),
          global: true,
        }),
      ],
    }).compile();

    service = module.get<StorageBlobService>(StorageBlobService);
  });

  test('should be global module', async () => {
    // TODO:
    expect(service).toBeDefined();
  });
});

describe('initialize StorageBlobModule using `forRootAsync`', () => {
  let service: StorageBlobService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        StorageBlobModule.registerAsync({
          useFactory: () => ({
            connection: process.env.NEST_STORAGE_BLOB_CONNECTION,
          }),
        }),
      ],
    }).compile();

    service = module.get<StorageBlobService>(StorageBlobService);
  });

  test('', async () => {
    expect(module).toBeDefined();
    expect(service).toBeInstanceOf(StorageBlobService);

    expect(service).toBeTruthy();
    expect(service.deleteFile).toBeTruthy();
    expect(service.getClient()).toBeInstanceOf(BlobServiceClient);
  });
});

describe('global StorageBlobModule', () => {
  let service: StorageBlobService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        StorageBlobModule.registerAsync({
          useFactory: () => ({
            connection: process.env.NEST_STORAGE_BLOB_CONNECTION,
          }),
          global: true,
        }),
      ],
    }).compile();

    service = module.get<StorageBlobService>(StorageBlobService);
  });

  test('', async () => {
    expect(service).toBeTruthy();
  });
});
