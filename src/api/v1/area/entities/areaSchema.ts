import {BaseDocument} from "../../../../core/entities/base.entity";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type AreaDocument = AreaEntity & Document;

@Schema()
export class AreaEntity extends BaseDocument {
  @Prop()
  code: string;

  @Prop()
  area: string;
}

export const AreaSchema = SchemaFactory.createForClass(AreaEntity);
