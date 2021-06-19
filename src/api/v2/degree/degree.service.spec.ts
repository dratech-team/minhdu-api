import { Test, TestingModule } from '@nestjs/testing';
import { DegreeService } from './degree.service';

describe('DegreeService', () => {
  let service: DegreeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DegreeService],
    }).compile();

    service = module.get<DegreeService>(DegreeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
