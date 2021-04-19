import {Document} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {BaseDocument} from "../../../../core/entities/base.entity";
import {Department} from "../../department/entities/department.entity";
import {ObjectId} from "mongodb";

export type PositionDocument = Position & Document;

@Schema()
export class Position extends BaseDocument {
  @Prop()
  position: string;

  @Prop()
  workDay: number;

  @Prop({type: [{type: ObjectId, ref: "Department"}]})
  departmentIds: Department;
}

export const PositionEntity = SchemaFactory.createForClass(Position);
