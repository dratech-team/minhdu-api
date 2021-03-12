import { Document } from "mongoose";

export class MedicineStorageInterface extends Document {
  code: string;
  vendorId: string;
  name: string;
  dateExpired: string;
  quantity: number;
  price: number;
  discount: number;
}
