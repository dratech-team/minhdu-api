import { Test, TestingModule } from "@nestjs/testing";
import { LoanSalaryController } from "./loan-salary.controller";

describe("LoanController", () => {
  let controller: LoanSalaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanSalaryController],
    }).compile();

    controller = module.get<LoanSalaryController>(LoanSalaryController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
