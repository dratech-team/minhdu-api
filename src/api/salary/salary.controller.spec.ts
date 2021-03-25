import { Test, TestingModule } from '@nestjs/testing';
import { SalaryController } from './salary.controller';

describe('SalaryController', () => {
  let controller: SalaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalaryController],
    }).compile();

    controller = module.get<SalaryController>(SalaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
