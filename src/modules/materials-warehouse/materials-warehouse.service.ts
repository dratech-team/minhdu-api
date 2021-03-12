import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ApiTags } from "@nestjs/swagger";
import { CreateMaterialsWarehouseDto } from "./dto/create-materials-warehouse.dto";
import { MaterialsWarehouseInterface } from "./interfaces/materials-warehouse.interface";

@ApiTags("MaterialsWarehouse")
@Injectable()
export class MaterialsWarehouseService {
  constructor(
    @InjectModel("materials-warehouse")
    private readonly materialsWarehouseModel: Model<MaterialsWarehouseInterface>
  ) {}

  async create(createMaterialsWarehouseDto: CreateMaterialsWarehouseDto) {
    const { name } = createMaterialsWarehouseDto;
    const countMaterialsWarehouse = await this.materialsWarehouseModel.countDocuments(
      { name }
    );

    if (countMaterialsWarehouse) {
      throw new HttpException("name Already Exist", HttpStatus.BAD_REQUEST);
    }

    return this.materialsWarehouseModel.create(createMaterialsWarehouseDto);
  }

  async findAll(query) {
    const { sort, skip = 0, limit = 20, text_search: textSearch } = query;
    const conditions: any = { deleted: false };

    if (textSearch) {
      conditions.name = new RegExp(textSearch, "i");
    }

    const [materialsWarehouse = [], total = 0] = await Promise.all([
      this.materialsWarehouseModel
        .find(conditions)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      this.materialsWarehouseModel.countDocuments(conditions)
    ]);

    return { materialsWarehouse, total };
  }

  async findOne(id: string) {
    return this.materialsWarehouseModel.findById(id).lean();
  }

  async remove(id: string) {
    await this.materialsWarehouseModel.updateOne(
      { _id: id },
      { deleted: true, deletedAt: new Date() }
    );
  }
}
