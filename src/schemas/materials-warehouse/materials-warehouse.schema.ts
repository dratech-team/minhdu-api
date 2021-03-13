import { Schema, connection } from "mongoose";
import { MaterialsWarehouseInterface } from "./materials-warehouse.interface";

export const MaterialsWarehouseSchema: Schema<MaterialsWarehouseInterface> = new Schema(
  {
    name: String,
    deleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  { versionKey: false, timestamps: true }
);
