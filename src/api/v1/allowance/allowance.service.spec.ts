import { Test, TestingModule } from '@nestjs/testing';
import { AllowanceService } from './allowance.service';

describe('AllowanceService', () => {
  let service: AllowanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllowanceService],
    }).compile();

    service = module.get<AllowanceService>(AllowanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
