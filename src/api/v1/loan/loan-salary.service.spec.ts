import { Test, TestingModule } from "@nestjs/testing";
import { LoanSalaryService } from "./loan-salary.service";

describe("LoanService", () => {
  let service: LoanSalaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoanSalaryService],
    }).compile();

    service = module.get<LoanSalaryService>(LoanSalaryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
