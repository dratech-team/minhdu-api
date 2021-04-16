import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseDocument } from "../../../../core/schema/base.schema";

export type PositionDocument = Position & Document;

@Schema()
export class Position extends BaseDocument {
  @Prop()
  position: string;

  @Prop()
  workDay: number;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
