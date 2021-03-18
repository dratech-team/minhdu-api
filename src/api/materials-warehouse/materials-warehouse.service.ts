import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateMaterialsWarehouseDto } from "./dto/create-materials-warehouse.dto";
import {
  MaterialsWarehouse,
  MaterialsWarehouseDocument,
} from "./schemas/materials-warehouse.schema";
import { GetMaterialsWarehouseDto } from "./dto/get-materials-warehouse.dto";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CorePaginateResult } from "../../core/paginate/pagination";

@ApiTags("MaterialsWarehouse")
@Injectable()
export class MaterialsWarehouseService {
  constructor(
    @InjectModel("materials-warehouse")
    private readonly materialsModel: Model<MaterialsWarehouseDocument>
  ) {}

  async create(
    createMaterialsWarehouseDto: CreateMaterialsWarehouseDto
  ): Promise<MaterialsWarehouse> {
    const createdCat = new this.materialsModel(createMaterialsWarehouseDto);
    return await createdCat.save();
  }

  async findAll(
    getMaterialsWarehouseDto: GetMaterialsWarehouseDto
  ): Promise<void> {
    const { sort, skip = 0, limit = 20, search } = getMaterialsWarehouseDto;

    const conditions: any = { deleted: false };

    if (search) {
      conditions.name = new RegExp(search, "i");
    }

    const results = await Promise.all([
      this.materialsModel.find(conditions).sort(sort).skip(skip).limit(limit),
      this.materialsModel.countDocuments(conditions),
    ]);

    // const materialsWarehouse: Array<MaterialsWarehouseInterface> =
    //   results[0] || [];
    // const total: number = results[1] || 0;

    // return results;
  }

  async findOne(id: string): Promise<MaterialsWarehouse> {
    const result = await this.materialsModel
      .findById(id, (err) => {
        if (err) {
          console.log("Id không hợp lệ vui lòng thử lại");
        }
      })
      .lean();
    if (result == null) {
      throw new HttpException(
        '"Sản phẩm không tồn tại"',
        HttpStatus.BAD_REQUEST
      );
    }
    console.log(result);

    return result;
  }

  async remove(
    id: string
  ): Promise<{ ok: number; n: number; nModified: number }> {
    return this.materialsModel.remove({ _id: id });
  }
}
