import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { CreateStorageDto } from "./dto/create-storage.dto";
import { UpdateStorageDto } from "./dto/update-storage.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { StorageInterface } from "../../schemas/storage/storage.interface";
import { VendorsInterface } from "../../schemas/vendors/vendors.interface";
import { MaterialsWarehouseInterface } from "../../schemas/materials-warehouse/materials-warehouse.interface";
import { dateHelpers } from "../../common/date-helpers.common";
import { queryHelpers } from "../../common/query-helpers";
import * as moment from "moment";
import { ApiTags, ApiResponse } from "@nestjs/swagger";

@ApiTags("Vendors")
@Injectable()
export class StorageService {
  constructor(
    @InjectModel("storage")
    private readonly storageModel: Model<StorageInterface>,
    @InjectModel("vendors")
    private readonly vendorModel: Model<VendorsInterface>,
    @InjectModel("materials-warehouse")
    private readonly materialsWarehouse: Model<MaterialsWarehouseInterface>
  ) {}

  async create(createStorageDto: CreateStorageDto) {
    const {
      code,
      vendorId,
      materialWarehouseId,
      dateExpired: newDateExpired,
      quantity,
      price: newPrice,
      discount: newDiscount
    } = createStorageDto;
    /* validate vendorId */
    const vendor = await this.vendorModel
      .findOne({ _id: vendorId, deleted: false })
      .lean();
    if (!vendor)
      throw new HttpException("vendorId Not Found", HttpStatus.NOT_FOUND);

    /* validate material ware house */
    const materialWarehouse = await this.materialsWarehouse
      .findOne({ _id: materialWarehouseId, deleted: false })
      .lean();

    if (!materialWarehouse) {
      throw new HttpException(
        "materialWarehouseId Not Found",
        HttpStatus.NOT_FOUND
      );
    }

    const now = new Date();
    const { end: endDateImport } = dateHelpers.getTimeStartAndEndOfDay(now);

    /* validate medicine storage exists*/
    const query = {
      code,
      deleted: false,
      dateImport: { $gte: endDateImport }
    };

    const storagesFound = await this.storageModel.find(query).lean();

    if (storagesFound.length) {
      const storageFound = storagesFound.find(item => {
        const {
          dateExpired: oldDateExpired,
          dateImport: oldDateImport,
          price: oldPrice,
          discount: oldDiscount
        }: any = item;

        const isEqualPrice = !!(newPrice === oldPrice);
        const isEqualDiscount = !!(newDiscount === oldDiscount);
        const isEqualDateExpired = !moment(newDateExpired).diff(
          moment(oldDateExpired),
          "days"
        );
        const isEqualDateImport = !moment(endDateImport).diff(
          moment(oldDateImport),
          "days"
        );
        return (
          isEqualPrice &&
          isEqualDiscount &&
          isEqualDateExpired &&
          isEqualDateImport
        );
      });

      if (storageFound) {
        const newQuantity = storageFound.quantity + quantity;
        return this.update(storageFound._id, { quantity: newQuantity });
      }
    }

    vendor.id = vendor._id;
    materialWarehouse.id = materialWarehouse._id;
    const { end: endDateExpired } = dateHelpers.getTimeStartAndEndOfDay(
      newDateExpired
    );
    const unitPrice = (newPrice * quantity) / newDiscount;

    const storage = {
      ...createStorageDto,
      price: newPrice,
      quantity: quantity,
      discount: newDiscount,
      materialWarehouse,
      vendor,
      dateExpired: new Date(endDateExpired),
      dateImport: new Date(endDateImport),
      unitPrice
    };

    return this.storageModel.create(storage);
  }

  async findAll(query) {
    const {
      materialWarehouseId,
      textSearch,
      vendorId,
      dateExpiredFrom,
      dateExpiredTo,
      dateImportFrom,
      dateImportTo,
      skip = 0,
      limit = 20,
      sort
    } = query;

    const conditions: any = {
      deleted: false,
      "materialWarehouse.id": materialWarehouseId
    };

    if (textSearch) {
      const $orTextSearch = queryHelpers.buildTextSearch(
        ["name", "vendor.name"],
        textSearch
      );
      conditions.$or = $orTextSearch;
    }

    if (vendorId) {
      conditions["vendor.id"] = vendorId;
    }

    /* build condition expired date */
    const conditionExpiredDate = [];

    if (dateExpiredFrom) {
      const { start: startExpiredDate } = dateHelpers.getTimeStartAndEndOfDay(
        dateExpiredFrom
      );
      conditionExpiredDate.push({
        dateExpired: { $gte: new Date(startExpiredDate) }
      });
    }

    if (dateExpiredTo) {
      const { end: endExpiredDate } = dateHelpers.getTimeStartAndEndOfDay(
        dateExpiredTo
      );
      conditionExpiredDate.push({
        dateExpired: { $lte: new Date(endExpiredDate) }
      });
    }

    if (conditionExpiredDate.length) {
      conditions.$and = conditionExpiredDate;
    }
    /* build condition import date */
    const conditionImportDate = [];

    if (dateImportFrom) {
      const { start: startImportDate } = dateHelpers.getTimeStartAndEndOfDay(
        dateImportFrom
      );
      conditionImportDate.push({
        dateImport: { $gte: new Date(startImportDate) }
      });
    }

    if (dateImportTo) {
      const { end: endImportDate } = dateHelpers.getTimeStartAndEndOfDay(
        dateImportTo
      );
      conditionImportDate.push({
        dateImport: { $lte: new Date(endImportDate) }
      });
    }

    if (conditionImportDate.length) {
      if (!conditions.$and) {
        conditions.$and = conditionImportDate;
      } else {
        conditions.$and = [...conditions.$and, ...conditionImportDate];
      }
    }
    console.log("conditions", conditions);
    console.log("sort", sort);

    const [items = [], total = 0] = await Promise.all([
      this.storageModel
        .find(conditions)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      this.storageModel.countDocuments(conditions)
    ]);

    return { items, total };
  }

  async findOne(id: string) {
    const conditions: any = { _id: id, deleted: false };
    return this.storageModel.findOne(conditions).lean();
  }

  async update(id: string, updateStorageDto: UpdateStorageDto) {
    return this.storageModel
      .findByIdAndUpdate({ _id: id }, updateStorageDto, { new: true })
      .lean();
  }

  async remove(id: string) {
    await this.storageModel.updateOne(
      { _id: id },
      { deleted: true, deletedAt: new Date() }
    );
    return;
  }
}
