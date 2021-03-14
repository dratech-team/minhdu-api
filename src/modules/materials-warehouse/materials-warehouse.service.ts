import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ApiTags } from "@nestjs/swagger";
import { CreateMaterialsWarehouseDto } from "./dto/create-materials-warehouse.dto";
import { MaterialsWarehouseInterface } from "./interfaces/materials-warehouse.interface";
import { typesHelpers } from "../../common/types-helpers.common";
@ApiTags("MaterialsWarehouse")
@Injectable()
export class MaterialsWarehouseService {
  constructor(
    @InjectModel("materials-warehouse")
    private readonly materialsWarehouseModel: Model<MaterialsWarehouseInterface>
  ) {}

  async create(
    createMaterialsWarehouseDto: CreateMaterialsWarehouseDto
  ): Promise<MaterialsWarehouseInterface> {
    const { name } = createMaterialsWarehouseDto;
    const countMaterialsWarehouse = await this.materialsWarehouseModel.countDocuments(
      { name }
    );

    if (countMaterialsWarehouse) {
      throw new HttpException(
        "Tên kho đã tồn tại trên hệ thống!",
        HttpStatus.BAD_REQUEST
      );
    }

    return this.materialsWarehouseModel.create(createMaterialsWarehouseDto);
  }

  async findAll(query): Promise<{ materialsWarehouse: any; total: Number }> {
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
      this.materialsWarehouseModel.countDocuments(conditions),
    ]);

    return { materialsWarehouse, total };
  }

  async findOne(id: string): Promise<MaterialsWarehouseInterface> {
    await this.validateMongoId(id);
    return this.materialsWarehouseModel.findById(id).lean();
  }

  async remove(
    id: string
  ): Promise<{ ok: number; n: number; nModified: number }> {
    await this.validateMongoId(id);
    return this.materialsWarehouseModel.updateOne(
      { _id: id },
      { deleted: true, deletedAt: new Date() }
    );
  }

  async validateMongoId(id: string): Promise<boolean> {
    const isId = typesHelpers.isStringMongoId(id);

    if (!isId) {
      throw new HttpException(`Id kho không hợp lệ !`, HttpStatus.BAD_REQUEST);
    }

    const materialsWarehouse = await this.materialsWarehouseModel.countDocuments(
      {
        _id: id,
      }
    );

    if (!materialsWarehouse) {
      throw new HttpException(`Kho không tồn tại!`, HttpStatus.NOT_FOUND);
    }

    return true;
  }
}
