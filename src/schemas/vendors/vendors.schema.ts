import { Schema, Document } from "mongoose";
import { VendorsInterface } from "./vendors.interface";

export const VendorsSchema: Schema<VendorsInterface> = new Schema(
  {
    code: { type: String, index: true, unique: true, required: true },
    name: String,
    address: String,
    note: String,
    deleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  { versionKey: false, timestamps: true }
);
