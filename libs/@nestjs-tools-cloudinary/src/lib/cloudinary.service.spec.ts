import { Test } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CloudinaryService],
    }).compile();

    service = module.get(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
