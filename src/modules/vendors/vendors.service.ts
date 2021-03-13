import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { CreateVendorDto } from "./dto/create-vendor.dto";
import { UpdateVendorDto } from "./dto/update-vendor.dto";
import { VendorsInterface } from "./interfaces/vendors.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { queryHelpers } from "../../common/query-helpers";
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
      throw new HttpException("code Already Exists", HttpStatus.BAD_REQUEST);
    }

    return this.vendorsModel.create(createVendorDto);
  }

  async findAll(query) {
    const { sort, skip = 0, limit = 20, text_search: textSearch } = query;
    const conditions: any = { deleted: false };

    if (textSearch) {
      const $orSearch = queryHelpers.buildTextSearch(
        ["code", "name"],
        textSearch
      );
      conditions.$or = $orSearch;
    }

    const [vendors = [], total = 0] = await Promise.all([
      this.vendorsModel
        .find(conditions)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      this.vendorsModel.countDocuments(conditions)
    ]);

    return { vendors, total };
  }

  async findOne(id: string) {
    return this.vendorsModel.findOne({ _id: id });
  }

  async remove(id: string) {
    await this.vendorsModel.updateOne(
      { _id: id },
      { deleted: true, deletedAt: new Date() }
    );
    return;
  }
}
