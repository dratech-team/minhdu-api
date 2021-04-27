import {BaseDocument} from "../../../../core/entities/base.entity";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ObjectId} from "mongodb";
import {Document} from "mongoose";
import * as bcrypt from "bcrypt";
import {UserType} from "../../../../core/constants/role-type.constant";

export type CredentialDocument = CredentialEntity & Document;

const SALT_ROUND = 10;

@Schema()
export class CredentialEntity extends BaseDocument {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  role: UserType;

  @Prop()
  userId: ObjectId;

  async generateHash(password: string): Promise<any> {
    const salt = await bcrypt.genSalt(SALT_ROUND);
    return bcrypt.hash(password, salt);
  }
}

export const CredentialSchema = SchemaFactory.createForClass(CredentialEntity);
