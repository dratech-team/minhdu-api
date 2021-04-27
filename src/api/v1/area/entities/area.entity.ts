import {BaseDocument} from "../../../../core/entities/base.entity";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";
import * as mongoosePaginate from 'mongoose-paginate';

export type AreaDocument = AreaEntity & Document;

@Schema({autoIndex: true})
export class AreaEntity extends BaseDocument {
  @Prop({unique: true})
  name: string;
}

export const AreaSchema = SchemaFactory.createForClass(AreaEntity).plugin(mongoosePaginate);
