import { Test, TestingModule } from '@nestjs/testing';
import { WardService } from './ward.service';

describe('WardService', () => {
  let service: WardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WardService],
    }).compile();

    service = module.get<WardService>(WardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
