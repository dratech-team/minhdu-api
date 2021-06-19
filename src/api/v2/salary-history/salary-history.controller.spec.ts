import { Test, TestingModule } from '@nestjs/testing';
import { SalaryHistoryController } from './salary-history.controller';
import { SalaryHistoryService } from './salary-history.service';

describe('SalaryHistoryController', () => {
  let controller: SalaryHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalaryHistoryController],
      providers: [SalaryHistoryService],
    }).compile();

    controller = module.get<SalaryHistoryController>(SalaryHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
