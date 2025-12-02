import { Test, TestingModule } from '@nestjs/testing';
import { PenjadwalanController } from './penjadwalan.controller';

describe('PenjadwalanController', () => {
  let controller: PenjadwalanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PenjadwalanController],
    }).compile();

    controller = module.get<PenjadwalanController>(PenjadwalanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
