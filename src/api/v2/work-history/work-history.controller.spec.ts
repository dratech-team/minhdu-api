import { Test, TestingModule } from '@nestjs/testing';
import { WorkHistoryController } from './work-history.controller';
import { WorkHistoryService } from './work-history.service';

describe('WorkHistoryController', () => {
  let controller: WorkHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkHistoryController],
      providers: [WorkHistoryService],
    }).compile();

    controller = module.get<WorkHistoryController>(WorkHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
