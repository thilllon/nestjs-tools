import { Test, TestingModule } from '@nestjs/testing';
import { SendgridService } from 'nestjs-sendgrid';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  const templateId = '';

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [SendgridService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return email template', async () => {
      const template = await appController.getTemplate(templateId);
      expect(typeof template).toBe('string');
    });
  });
});
