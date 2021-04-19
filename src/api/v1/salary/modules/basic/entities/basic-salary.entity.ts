import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ISalary } from "../../../../../../common/entities/salary.entity";

export type BasicSalaryDocument = Document & BasicSalary;

@Schema()
export class BasicSalary extends ISalary {}

export const BasicSalaryEntity = SchemaFactory.createForClass(BasicSalary);
