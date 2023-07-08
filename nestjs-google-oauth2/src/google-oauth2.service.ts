import { Injectable } from '@nestjs/common';
import { OAuth2Client, OAuth2ClientOptions } from 'google-auth-library';

import { InjectGoogleOauth2Options } from './google-oauth2.decorator';

@Injectable()
export class GoogleOAuth2Service extends OAuth2Client {
  constructor(
    @InjectGoogleOauth2Options()
    private readonly options: OAuth2ClientOptions,
  ) {
    super(options);
  }
}
