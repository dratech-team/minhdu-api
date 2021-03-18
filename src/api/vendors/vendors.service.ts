import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { CreateVendorDto } from "./dto/create-vendor.dto";
import { UpdateVendorDto } from "./dto/update-vendor.dto";
import { VendorsInterface } from "./interfaces/vendors.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { queryHelpers } from "../../core/common/query-helpers";
import { typesHelpers } from "../../core/common/types-helpers.common";
@Injectable()
export class VendorsService {
  constructor(
    @InjectModel("vendors")
    private readonly vendorsModel: Model<VendorsInterface>
  ) {}

  async create(createVendorDto: CreateVendorDto): Promise<VendorsInterface> {
    const { code } = createVendorDto;
    const vendor = await this.vendorsModel.countDocuments({ code });

    if (vendor) {
      throw new HttpException(
        "Mã nhà cung cấp đã tồn tại trên hệ thống!",
        HttpStatus.BAD_REQUEST
      );
    }

    return this.vendorsModel.create(createVendorDto);
  }

  async findAll(
    query
  ): Promise<{ vendors: Array<VendorsInterface>; total: Number }> {
    const { sort, skip = 0, limit = 20, text_search: textSearch } = query;
    const conditions: any = { deleted: false };

    if (textSearch) {
      const $orSearch = queryHelpers.buildTextSearch(
        ["code", "name"],
        textSearch
      );
      conditions.$or = $orSearch;
    }

    const results = await Promise.all([
      this.vendorsModel.find(conditions).sort(sort).skip(skip).limit(limit),
      this.vendorsModel.countDocuments(conditions),
    ]);

    const vendors: Array<VendorsInterface> = results[0] || [];
    const total: number = results[1] || 0;

    return { vendors, total };
  }

  async findOne(id: string): Promise<VendorsInterface> {
    await this.validateMongoId(id);
    return this.vendorsModel.findOne({ _id: id });
  }

  async remove(
    id: string
  ): Promise<{ ok: number; n: number; nModified: number }> {
    await this.validateMongoId(id);
    return this.vendorsModel.updateOne(
      { _id: id },
      { deleted: true, deletedAt: new Date() }
    );
  }

  async validateMongoId(id: string): Promise<boolean> {
    const isId = typesHelpers.isStringMongoId(id);

    if (!isId) {
      throw new HttpException(
        `Id nhà cung cấp không hợp lệ !`,
        HttpStatus.BAD_REQUEST
      );
    }

    const vendor = await this.vendorsModel.countDocuments({
      _id: id,
    });

    if (!vendor) {
      throw new HttpException(
        `Nhà cung cấp không tồn tại!`,
        HttpStatus.NOT_FOUND
      );
    }

    return true;
  }
}
