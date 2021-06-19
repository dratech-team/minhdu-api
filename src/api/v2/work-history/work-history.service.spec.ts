import { Test, TestingModule } from '@nestjs/testing';
import { WorkHistoryService } from './work-history.service';

describe('WorkHistoryService', () => {
  let service: WorkHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkHistoryService],
    }).compile();

    service = module.get<WorkHistoryService>(WorkHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
