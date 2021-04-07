import { Test, TestingModule } from '@nestjs/testing';
import { BasicSalaryController } from './basic-salary.controller';

describe('BasicSalaryController', () => {
  let controller: BasicSalaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BasicSalaryController],
    }).compile();

    controller = module.get<BasicSalaryController>(BasicSalaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
