import { Inject } from '@nestjs/common';

import { MODULE_CLIENT_TOKEN } from './octokit.constants';

export const InjectOctokit = () => {
  return Inject(MODULE_CLIENT_TOKEN);
};
