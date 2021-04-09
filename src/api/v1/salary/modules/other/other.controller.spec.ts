import { Test, TestingModule } from '@nestjs/testing';
import { OtherController } from './other.controller';

describe('OtherController', () => {
  let controller: OtherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtherController],
    }).compile();

    controller = module.get<OtherController>(OtherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
