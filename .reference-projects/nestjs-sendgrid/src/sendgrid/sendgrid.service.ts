import { Inject, Injectable } from '@nestjs/common';
import { Client } from '@sendgrid/client';
import { MODULE_CLIENT_TOKEN } from './sendgrid.constants';

@Injectable()
export class SendgridService {
  constructor(@Inject(MODULE_CLIENT_TOKEN) private readonly client: Client) {}

  getClient() {
    return this.client;
  }

  // https://docs.sendgrid.com/api-reference/transactional-templates/retrieve-a-single-transactional-template
  async getTemplate(templateId: string) {
    const results = await this.client.request({
      method: 'GET',
      url: `/v3/templates/${templateId}`,
    });
    return results;
  }
}
