import { Inject, Injectable } from '@nestjs/common';
import { GoogleApis, google } from 'googleapis';

import { ModuleOptions } from './googleapis.interface';
import { getOptionsToken } from './googleapis.utils';

@Injectable()
export class GoogleApisService extends GoogleApis {
  constructor(@Inject(getOptionsToken()) options: ModuleOptions) {
    super(options);
  }
}

// const auth = new google.auth.JWT({
//   email: this.googleDriveOptions.clientEmail,
//   key: this.googleDriveOptions.privateKey,
//   scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file'],
// });
// return google.drive({ version: 'v3', auth });
