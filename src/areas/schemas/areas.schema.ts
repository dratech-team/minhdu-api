import { Schema, Document } from "mongoose";
import * as bcrypt from "bcrypt";
import { AreasInterface } from "../interfaces/areas.interface";
import { STATUS } from "../../constants/areas.constant";

const { ObjectId } = Schema.Types;

export const AreasSchema: Schema<AreasInterface> = new Schema(
  {
    code: { type: String, index: true, unique: true },
    name: String,
    type: String,
    status: { type: Number, enum: Object.values(STATUS) },
    address: String,
    createdBy: ObjectId,
    updatedBy: ObjectId
  },
  { versionKey: false, timestamps: true }
);
