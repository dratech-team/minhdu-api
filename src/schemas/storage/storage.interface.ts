import { Document } from "mongoose";

export class StorageInterface extends Document {
  code: string;
  vendorId: string;
  materialWarehouseId: string;
  name: string;
  dateExpired: string;
  quantity: number;
  price: number;
  discount: number;
}
