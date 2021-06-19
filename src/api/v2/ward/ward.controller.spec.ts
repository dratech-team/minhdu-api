import { Test, TestingModule } from '@nestjs/testing';
import { WardController } from './ward.controller';
import { WardService } from './ward.service';

describe('WardController', () => {
  let controller: WardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WardController],
      providers: [WardService],
    }).compile();

    controller = module.get<WardController>(WardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
