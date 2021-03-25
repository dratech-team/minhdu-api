import { Document } from "mongoose";

export interface SalaryInterface extends Document {
  salary: number;
}
