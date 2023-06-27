import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
// import { AppModule } from '../example/src/app.module';
AppModule
import * as dotenv from 'dotenv';
import { beforeEach, describe, expect, test } from '@jest/globals';

dotenv.config({ path: '.env' });

describe('nestjs-azure-storage-blob (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  test('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        console.log(res.body);
        const data = res.body;
        expect(data).toHaveProperty('message');
      });
  });
});
