import {Document} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {BaseDocument} from "../../../../core/schema/base.schema";
import {Department} from "../../department/schema/department.schema";
import {ObjectId} from "mongodb";

export type PositionDocument = Position & Document;

@Schema()
export class Position extends BaseDocument {
  @Prop()
  position: string;

  workDay: number;

  @Prop({type: [{type: ObjectId, ref: "Department"}]})
  departmentIds: Department;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
