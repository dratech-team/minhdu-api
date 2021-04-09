import { Test, TestingModule } from "@nestjs/testing";
import { DeductionSalaryController } from "./deduction-salary.controller";

describe("DeductionController", () => {
  let controller: DeductionSalaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeductionSalaryController],
    }).compile();

    controller = module.get<DeductionSalaryController>(
      DeductionSalaryController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
