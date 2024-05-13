import { BlobServiceClient } from '@azure/storage-blob';
import { Test } from '@nestjs/testing';
import * as dotenv from 'dotenv';
import { AzureStorageBlobModule } from './azure-storage-blob.module';
import { AzureStorageBlobService } from './azure-storage-blob.service';

dotenv.config({ path: '.env.test' });

describe('initialize StorageBlobModule using `forRoot`', () => {
  let service: AzureStorageBlobService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AzureStorageBlobModule.register({
          connection: process.env.NESTJS_STORAGE_BLOB_CONNECTION,
        }),
      ],
    }).compile();

    service = module.get<AzureStorageBlobService>(AzureStorageBlobService);
  });

  test('should be defined', async () => {
    expect(module).toBeDefined();
    expect(service).toBeInstanceOf(AzureStorageBlobService);
    expect(service).toBeTruthy();
    expect(service.deleteFile).toBeTruthy();
    expect(service.getClient()).toBeInstanceOf(BlobServiceClient);
  });
});

describe('global StorageBlobModule', () => {
  let service: AzureStorageBlobService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AzureStorageBlobModule.registerAsync(
          {
            useFactory: () => ({
              connection: process.env.NESTJS_STORAGE_BLOB_CONNECTION,
            }),
          },
          {
            global: true,
          },
        ),
      ],
      providers: [],
    }).compile();

    service = module.get<AzureStorageBlobService>(AzureStorageBlobService);
  });

  test('should be global module', async () => {
    // TODO:
    expect(service).toBeDefined();
  });
});

describe('initialize StorageBlobModule using `forRootAsync`', () => {
  let service: AzureStorageBlobService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AzureStorageBlobModule.registerAsync({
          useFactory: () => ({
            connection: process.env.NESTJS_STORAGE_BLOB_CONNECTION,
          }),
        }),
      ],
    }).compile();

    service = module.get<AzureStorageBlobService>(AzureStorageBlobService);
  });

  test('', async () => {
    expect(module).toBeDefined();
    expect(service).toBeInstanceOf(AzureStorageBlobService);

    expect(service).toBeTruthy();
    expect(service.deleteFile).toBeTruthy();
    expect(service.getClient()).toBeInstanceOf(BlobServiceClient);
  });
});

describe('global StorageBlobModule', () => {
  let service: AzureStorageBlobService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AzureStorageBlobModule.registerAsync(
          {
            useFactory: () => ({
              connection: process.env.NESTJS_STORAGE_BLOB_CONNECTION,
            }),
          },
          {
            global: true,
          },
        ),
      ],
    }).compile();

    service = module.get<AzureStorageBlobService>(AzureStorageBlobService);
  });

  test('', async () => {
    expect(service).toBeTruthy();
  });
});
