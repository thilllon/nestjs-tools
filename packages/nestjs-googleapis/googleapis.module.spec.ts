import { writeFileSync } from 'fs';
import * as path from 'path';

import { beforeAll, describe, expect, test } from '@jest/globals';
import { Injectable, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as dotenv from 'dotenv';
import { GoogleApis, drive_v3, sheets_v4 } from 'googleapis';

import { InjectGoogleApis } from './googleapis.decorator';
import { GoogleApisModule } from './googleapis.module';

describe('GoogleapisModule', () => {
  dotenv.config({ path: '.env.test' });

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const scopes = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'];

  @Injectable()
  class FooService {
    private readonly drive: drive_v3.Drive;
    private readonly sheet: sheets_v4.Sheets;

    constructor(@InjectGoogleApis() private readonly googleApis: GoogleApis) {
      this.drive = googleApis.drive('v3');
      this.sheet = googleApis.sheets('v4');
    }

    async writeToSheet(spreadsheetId: string) {
      await this.sheet.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A1',
        requestBody: {
          values: [['Hello World!']],
        },
      });
    }

    async listFiles() {
      const res = await this.drive.files.list();
      Logger.debug(res.data.files);
      return res.data;
    }

    async upload() {
      const name = `test_${Date.now()}.txt`;
      const filePath = path.join(__dirname, name);
      const requestData = 'Hello World!';
      writeFileSync(filePath, requestData, { encoding: 'utf-8' });
      const res = await this.drive.files.create({
        requestBody: { name },
      });
      return res.data;
    }
  }

  let fooService: FooService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [GoogleApisModule.register({ email, key, scopes }, {})],
      providers: [FooService],
    }).compile();

    fooService = module.get(FooService);
  });

  // test('asdf', async () => {
  //   const auth = new google.auth.JWT({ email, key, scopes });
  //   const googleApis = new GoogleApis({ auth });
  //   const drive = googleApis.drive({ version: 'v3' });

  //   const res = await drive.files.create({
  //     requestBody: {
  //       name: Date.now() + 'test.txt',
  //       description: 'description',
  //       driveId: '10i5385vGILZqGRtj-w8NJyNKl8BLJGFy',
  //     },
  //   });
  //   console.log(res.data);
  //   expect(res.data).toBeDefined();

  //   const { data } = await drive.files.list({});
  //   console.log(data.files);
  //   expect(data.files?.length).toBe(6);
  // });

  test('should list up files', async () => {
    expect(fooService).toBeDefined();
    const response = await fooService.listFiles();
    expect(response.files).toBeDefined();
  });

  test('should upload file', async () => {
    const response = await fooService.upload();
    expect(response).toBeDefined();
  });
});
