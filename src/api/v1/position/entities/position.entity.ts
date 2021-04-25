import {Document} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {BaseDocument} from "../../../../core/entities/base.entity";
import {DepartmentEntity} from "../../department/entities/department.entity";
import {ObjectId} from "mongodb";

export type PositionDocument = PositionEntity & Document;

@Schema()
export class PositionEntity extends BaseDocument {
  @Prop()
  position: string;

  @Prop()
  workDay: number;

  @Prop({type: [{type: ObjectId, ref: "Department"}]})
  departmentIds: DepartmentEntity;
}

export const PositionSchema = SchemaFactory.createForClass(PositionEntity);
