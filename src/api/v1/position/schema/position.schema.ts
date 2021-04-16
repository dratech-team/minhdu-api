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

  @Prop()
  wordDay: number;

  @Prop({type: ObjectId, ref: "Department"})
  department: Department;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
