import { Test, TestingModule } from "@nestjs/testing";
import { BasicSalaryService } from "./basic-salary.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelName } from "../../../../../common/constant/database.constant";
import { BasicSalarySchema } from "./schema/basic-salary.schema";

describe("BasicSalaryService", () => {
  let service: BasicSalaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: ModelName.BASIC_SALARY, schema: BasicSalarySchema },
        ]),
      ],
      providers: [BasicSalaryService],
    }).compile();

    service = module.get<BasicSalaryService>(BasicSalaryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
