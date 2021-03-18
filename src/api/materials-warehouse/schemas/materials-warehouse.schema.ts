import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MaterialsWarehouseDocument = MaterialsWarehouse & Document;

@Schema()
export class MaterialsWarehouse {
  @Prop({ unique: true })
  name: string;

  @Prop({ default: false })
  deleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const MaterialsWarehouseSchema = SchemaFactory.createForClass(
  MaterialsWarehouse
);
