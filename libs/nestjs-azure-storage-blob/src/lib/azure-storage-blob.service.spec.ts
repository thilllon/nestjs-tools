/* eslint-disable @typescript-eslint/no-unused-vars */
import { BlobServiceClient } from '@azure/storage-blob';
import { Test } from '@nestjs/testing';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import {
  MODULE_CLIENT_TOKEN,
  MODULE_CONNECTION_VARIABLE_TOKEN,
} from './azure-storage-blob.constants';
import { AzureStorageBlobService } from './azure-storage-blob.service';

dotenv.config({ path: '.env.test' });

describe('StorageBlobService', () => {
  let service: AzureStorageBlobService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AzureStorageBlobService,
        {
          provide: MODULE_CLIENT_TOKEN,
          useValue: BlobServiceClient.fromConnectionString(
            process.env[MODULE_CONNECTION_VARIABLE_TOKEN],
          ),
        },
      ],
    }).compile();

    service = module.get(AzureStorageBlobService);
  });

  test('should be defined', () => {
    expect(service).toBeTruthy();
  });

  test('should check account SAS URL', async () => {
    const { sasUrl, headers } = await service.getAccountSasUrl();
    expect(typeof sasUrl).toBe('string');
    expect(sasUrl.startsWith('https://')).toBe(true);
    // expect(headers).toBeTruthy();
  });

  test('should check container SAS URL ', async () => {
    const { sasUrl, headers } = await service.getContainerSasUrl(
      'test',
      { add: true },
      { expiresOn: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7) },
    );
    expect(typeof sasUrl).toBe('string');
    expect(sasUrl.startsWith('https://')).toBe(true);
    // expect(headers).toBeTruthy();
  });

  test('should check block BLOB SAS URL', async () => {
    const containerName = 'mycontainer';
    const fileName = 'myfile.txt';

    const { sasUrl, headers } = await service.getBlockBlobSasUrl(
      containerName,
      fileName,
      { add: true, create: true },
      { expiresOn: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7) },
    );
    expect(typeof sasUrl).toBe('string');
    expect(sasUrl.startsWith('https://')).toBe(true);
    expect(headers).toBeTruthy();
  });

  test('should be valid URL', async () => {
    const containerName = process.env.NEST_STORAGE_BLOB_CONTAINER;
    const fileName = 'image.jpg';

    const { sasUrl, headers } = await service.getBlockBlobSasUrl(
      containerName,
      fileName,
      { add: true, create: true },
      { expiresOn: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7) },
    );

    const buffer = fs.readFileSync(path.join(process.cwd(), 'test', 'fixture', fileName));
    const { data, status } = await axios.put(sasUrl, buffer, { headers });
    expect(status).toBe(201);
    expect(data).toBeTruthy();
  });

  // TODO: complete test case
  // test('should upload files', () => {
  //   // https://gist.github.com/binki/10ac3e91851b524546f8279733cdadad
  //   expect(true).toBe(true);
  // });
});
