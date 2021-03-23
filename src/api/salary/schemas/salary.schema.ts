import * as mongoose from "mongoose";

export const SalarySchema = new mongoose.Schema({
  basic: {
    type: Number,
    required: true,
  },
});
