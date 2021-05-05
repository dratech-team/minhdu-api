import { Test, TestingModule } from '@nestjs/testing';
import { SalaryController } from './salary.controller';
import { SalaryService } from './salary.service';

describe('SalaryController', () => {
  let controller: SalaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalaryController],
      providers: [SalaryService],
    }).compile();

    controller = module.get<SalaryController>(SalaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
