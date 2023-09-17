# nestjs-azure-storage-blob

Azure Blob Storage module for Nest.js

# Introduction

- Nest.js with [@azure/storage-blob](https://www.npmjs.com/package/@azure/storage-blob)

- [@nestjs/azure-storage](https://www.npmjs.com/package/@nestjs/azure-storage)
  - does not provide the method to upload a file using presigned url
  - does not provide multiple authentication methods
  - does not provide method to upload files directly to Azure without passing through my server

# Usage

## Setup

- Install packages

```sh
npm install nestjs-azure-storage-blob @azure/storage-blob
```

- Set environment variables(`.env`)

```sh
# required
NEST_STORAGE_BLOB_CONNECTION="DefaultEndpointsProtocol=https;AccountName=<ACCOUNT_NAME>;AccountKey=<ACCOUNT_KEY>;EndpointSuffix=core.windows.net"

# optional
NEST_STORAGE_BLOB_CONTAINER="<CONTAINER_NAME>"
```

### Option 1

```ts
// app.module.ts

import { Module } from '@nestjs/common';
import { StorageBlobModule } from 'nestjs-azure-storage-blob';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    StorageBlobModule.forRoot({
      connection: process.env.NEST_STORAGE_BLOB_CONNECTION,
      isGlobal: true, // optional
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Option 2

```ts
// app.module.ts

import { Module } from '@nestjs/common';
import { StorageBlobModule } from 'nestjs-azure-storage-blob';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    StorageBlobModule.forRootAsync({
      useFactory: () => ({
        connection: process.env.NEST_STORAGE_BLOB_CONNECTION,
      }),
      isGlobal: true, // optional
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Usage

```ts
// app.controller.ts

import { Controller, Get } from '@nestjs/common';
import { StorageBlobService } from 'nestjs-azure-storage-blob';

@Controller()
export class AppController {
  constructor(private readonly storageBlobService: StorageBlobService) {}

  @Get('/')
  async getSas() {
    const containerName = 'mycontainer';
    const fileName = 'test.txt';
    const expiresOn = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);

    const accountSasUrl = await this.storageBlobService.getAccountSasUrl();

    const containerSasUrl = await this.storageBlobService.getContainerSasUrl(containerName);

    const blobSasUrl = await this.storageBlobService.getBlockBlobSasUrl(
      containerName,
      fileName,
      { add: true, create: true, read: true, delete: true },
      { expiresOn },
    );

    return { accountSasUrl, containerSasUrl, blobSasUrl };
  }
}
```

```ts
// Example 1. Upload file from server-side

// Get Blob SAS URL which will be endpoint of uploading file
const res = await axios.get('https://<YOUR_SERVER>/block-blob-sas');
const blobSasUrl = res.data.blobSasUrl;

// Upload a file directly to Azure Blob Storage which reduces the load on the server
const buffer = fs.readFileSync(path.join(process.cwd(), 'myimage.jpg'));

if (buffer) {
  await axios
    // Do not use `FormData`
    .put(blobSasUrl, buffer, {
      headers: {
        // Do not forget to set headers
        'x-ms-blob-type': 'BlockBlob',
      },
    })
    .then((res) => {
      // 201 Created
      console.log(res.status);
    })
    .catch((err: any) => {
      console.error(err.message);
    });
}
```

```ts
// Example 2. Upload file from browser-side

const onChange: ChangeEventHandler<HTMLInputElement> = async (ev) => {
  const file = ev.file;

  // Get Blob SAS URL which will be endpoint of uploading file
  const res = await axios.get('https://<YOUR_SERVER>/block-blob-sas');
  const blobSasUrl = res.data.blobSasUrl;

  axios
    // Do not use `FormData`
    .put(blobSasUrl, file, {
      headers: {
        // Do not forget to set headers
        'x-ms-blob-type': 'BlockBlob',
      },
    })
    .then((res) => {
      // 201 Created
      console.log(res.status);
    })
    .catch((err: any) => {
      console.error(err.message);
    });
};
```

# Contribution

## Install

```sh
# to test locally
pnpm add link:./path/to/nestjs-azure-storage-blob
```

## Publish

```sh
# 2FA error occurs when using yarn on Windows machine
pnpm release
```

## Test

```sh
# set environment variable at `./example/.env.test`
NEST_STORAGE_BLOB_CONNECTION="DefaultEndpointsProtocol=https;AccountName=<ACCOUNT_NAME>;AccountKey=<ACCOUNT_KEY>;EndpointSuffix=core.windows.net"
NEST_STORAGE_BLOB_CONTAINER="<CONTAINER_NAME>"
```

# nestjs-azure-storage-blob
