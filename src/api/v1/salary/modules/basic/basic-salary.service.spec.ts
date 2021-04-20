import { Test, TestingModule } from "@nestjs/testing";
import { BasicSalaryService } from "./basic-salary.service";
import { MongooseModule, MongooseModuleAsyncOptions } from "@nestjs/mongoose";
import { BasicSalarySchema } from "./entities/basic-salary.schema";
import { BasicSalaryModule } from "./basic-salary.module";
import { ModelName } from "../../../../../common/constant/database.constant";
import { ConfigModule } from "../../../../../core/config/config.module";
import { ConfigService } from "../../../../../core/config/config.service";
import { CreateBasicSalaryDto } from "./dto/create-basic-salary.dto";

describe("BasicSalaryService", () => {
  let service: BasicSalaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) =>
            ({
              uri: configService.mongoURL,
              useNewUrlParser: true,
              useUnifiedTopology: true,
              useCreateIndex: true,
              useFindAndModify: false,
              connectionName: configService.databaseName,
            } as MongooseModuleAsyncOptions),
          inject: [ConfigService],
        }),
        MongooseModule.forFeature([
          { name: ModelName.BASIC_SALARY, schema: BasicSalarySchema },
        ]),
        BasicSalaryModule,
      ],
      providers: [BasicSalaryService],
    }).compile();

    service = module.get<BasicSalaryService>(BasicSalaryService);
  });

  it("create basic salary", () => {
    expect(service.create(undefined)).toBeDefined();
  });
});
