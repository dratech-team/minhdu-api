import {BaseDocument} from "../../../../core/entities/base.entity";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ObjectId} from "mongodb";
import {Document} from "mongoose";
import {generateHash} from "../../../../core/methods/validators.method";

export type CredentialDocument = CredentialEntity & Document;

@Schema()
export class CredentialEntity extends BaseDocument {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  userId: ObjectId;
}

export const CredentialSchema = SchemaFactory.createForClass(CredentialEntity);
