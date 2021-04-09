import { Test, TestingModule } from "@nestjs/testing";
import { DeductionService } from "./deduction-salary.service";

describe("DeductionService", () => {
  let service: DeductionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeductionService],
    }).compile();

    service = module.get<DeductionService>(DeductionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
