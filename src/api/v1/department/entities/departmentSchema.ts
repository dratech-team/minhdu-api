import { BaseDocument } from "../../../../core/entities/base.entity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type DepartmentDocument = DepartmentEntity & Document;

@Schema()
export class DepartmentEntity extends BaseDocument {
  @Prop()
  department: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(DepartmentEntity);
