import { BaseDocument } from "../../../../core/schema/base.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type DepartmentDocument = Department & Document;

@Schema()
export class Department extends BaseDocument {
  @Prop()
  department: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
