import { Test, TestingModule } from "@nestjs/testing";
import { MaterialsWarehouseService } from "./materials-warehouse.service";

describe("MaterialsWarehouseService", () => {
  let service: MaterialsWarehouseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaterialsWarehouseService]
    }).compile();

    service = module.get<MaterialsWarehouseService>(MaterialsWarehouseService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
