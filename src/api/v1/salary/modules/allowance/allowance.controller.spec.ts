import { Test, TestingModule } from '@nestjs/testing';
import { AllowanceController } from './allowance.controller';

describe('AllowanceController', () => {
  let controller: AllowanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllowanceController],
    }).compile();

    controller = module.get<AllowanceController>(AllowanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
