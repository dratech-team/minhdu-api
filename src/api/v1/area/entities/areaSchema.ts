import {BaseDocument} from "../../../../core/entities/base.entity";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type AreaDocument = AreaEntity & Document;

@Schema()
export class AreaEntity extends BaseDocument {
  @Prop({
    type: String,
    required: true,
    unique: true
  })
  area: String;
}

export const AreaSchema = SchemaFactory.createForClass(AreaEntity);
