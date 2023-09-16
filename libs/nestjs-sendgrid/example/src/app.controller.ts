import { Controller, Get, Query } from '@nestjs/common';
import { SendgridService } from 'nestjs-sendgrid';

@Controller()
export class AppController {
  constructor(private readonly sendgridService: SendgridService) {}

  @Get()
  getTemplate(@Query('templateId') templateId: string) {
    return this.sendgridService.getTemplate(templateId);
  }
}
