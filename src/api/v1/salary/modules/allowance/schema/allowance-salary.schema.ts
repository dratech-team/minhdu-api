import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ISalary } from "../../../../../../common/schemas/salary.schema";
// import { ISalary } from "@/common/schemas/salary.schema";

export type AllowanceSalaryDocument = Document & AllowanceSalary;

@Schema()
export class AllowanceSalary extends ISalary {}

export const AllowanceSalarySchema = SchemaFactory.createForClass(
  AllowanceSalary
);
