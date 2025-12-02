import { Test, TestingModule } from '@nestjs/testing';
import { KrsService } from './krs.service';

describe('KrsService', () => {
  let service: KrsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KrsService],
    }).compile();

    service = module.get<KrsService>(KrsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
