import { Inject } from '@nestjs/common';
import { MODULE_CLIENT_TOKEN } from './storage-blob.constants';

export function InjectStorageBlob() {
  return Inject(MODULE_CLIENT_TOKEN);
}
