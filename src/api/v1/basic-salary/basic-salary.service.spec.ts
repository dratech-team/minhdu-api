import { Test, TestingModule } from '@nestjs/testing';
import { BasicSalaryService } from './basic-salary.service';

describe('BasicSalaryService', () => {
  let service: BasicSalaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BasicSalaryService],
    }).compile();

    service = module.get<BasicSalaryService>(BasicSalaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
