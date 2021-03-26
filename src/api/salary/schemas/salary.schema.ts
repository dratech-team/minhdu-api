import * as mongoose from "mongoose";
import { ModelName } from "@/constants/database.constant";

export const SalarySchema = new mongoose.Schema({
  basic: {
    type: Number,
    required: true,
  },
});
