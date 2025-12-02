import { Test, TestingModule } from '@nestjs/testing';
import { KrsController } from './krs.controller';

describe('KrsController', () => {
  let controller: KrsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KrsController],
    }).compile();

    controller = module.get<KrsController>(KrsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
