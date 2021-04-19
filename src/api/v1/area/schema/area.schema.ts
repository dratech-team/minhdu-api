import {BaseDocument} from "../../../../core/schema/base.schema";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type AreaDocument = Area & Document;

@Schema()
export class Area extends BaseDocument {
  @Prop()
  code: string;

  @Prop()
  area: string;
}

export const AreaSchema = SchemaFactory.createForClass(Area);
