import { Test, TestingModule } from '@nestjs/testing';
import { DegreeController } from './degree.controller';
import { DegreeService } from './degree.service';

describe('DegreeController', () => {
  let controller: DegreeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DegreeController],
      providers: [DegreeService],
    }).compile();

    controller = module.get<DegreeController>(DegreeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
