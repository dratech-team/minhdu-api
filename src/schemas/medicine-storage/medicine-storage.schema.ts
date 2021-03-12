import { Schema } from "mongoose";
import { MedicineStorageInterface } from "./medicine-storage.interface";
const { ObjectId } = Schema.Types;

export const MedicineStorageSchema: Schema<MedicineStorageInterface> = new Schema(
  {
    code: { type: String, index: true, unique: true, required: true },
    vendor: {
      id: ObjectId,
      code: String,
      name: String
    },
    name: { type: String, required: true },
    dateExpired: { type: Date, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: Number,
    dateImport: { type: Date, required: true },

    unitPrice: { type: Number, required: true },
    deleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  { versionKey: false, timestamps: true }
);
