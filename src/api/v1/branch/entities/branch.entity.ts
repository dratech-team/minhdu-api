import {BaseDocument} from "../../../../core/entities/base.entity";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ObjectId} from "mongodb";
import {AreaEntity} from "../../area/entities/area.entity";
import {Document} from "mongoose";

export type BranchDocument = BranchEntity & Document;

@Schema()
export class BranchEntity extends BaseDocument {
  @Prop()
  code: string;

  @Prop()
  branch: string;

  @Prop({type: ObjectId, ref: "Area"})
  areaId: AreaEntity;
}

export const BranchSchema = SchemaFactory.createForClass(BranchEntity);
