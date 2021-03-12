import { Test, TestingModule } from "@nestjs/testing";
import { MaterialsWarehouseController } from "./materials-warehouse.controller";
import { MaterialsWarehouseService } from "./materials-warehouse.service";

describe("MaterialsWarehouseController", () => {
  let controller: MaterialsWarehouseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialsWarehouseController],
      providers: [MaterialsWarehouseService]
    }).compile();

    controller = module.get<MaterialsWarehouseController>(
      MaterialsWarehouseController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
