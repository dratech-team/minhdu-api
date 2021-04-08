import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ISalary } from "../../../../common/schemas/salary.schema";

export type BasicSalaryDocument = Document & BasicSalary;

@Schema()
export class BasicSalary extends ISalary {}

export const BasicSalarySchema = SchemaFactory.createForClass(BasicSalary);
