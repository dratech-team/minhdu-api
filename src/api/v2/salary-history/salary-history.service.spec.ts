import { Test, TestingModule } from '@nestjs/testing';
import { SalaryHistoryService } from './salary-history.service';

describe('SalaryHistoryService', () => {
  let service: SalaryHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalaryHistoryService],
    }).compile();

    service = module.get<SalaryHistoryService>(SalaryHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
