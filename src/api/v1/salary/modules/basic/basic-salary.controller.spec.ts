import { Test, TestingModule } from "@nestjs/testing";
import { BasicSalaryController } from "./basic-salary.controller";
import { BasicSalaryService } from "./basic-salary.service";
import { CreateBasicSalaryDto } from "./dto/create-basic-salary.dto";

describe("BasicSalaryController", () => {
  let controller: BasicSalaryController;
  let service: BasicSalaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BasicSalaryController],
      providers: [BasicSalaryService],
    }).compile();

    controller = module.get<BasicSalaryController>(BasicSalaryController);
    service = module.get<BasicSalaryService>(BasicSalaryService);
  });

  describe("create", () => {
    it("should return a title and an amount ", async () => {
      const result = {
        title: "test 1",
        amount: 1,
      };

      const body = new CreateBasicSalaryDto();
      body.title = "test 1";
      body.amount = 1;

      const re = await jest.spyOn(service, "create").mockImplementation();
      expect(await controller.create(body)).toBe(result);
    });
  });
});
