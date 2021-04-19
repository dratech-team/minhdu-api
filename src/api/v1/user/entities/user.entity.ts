import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { IUser } from "../../../../common/entities/user.entity";

export type UserDocument = User & Document;

@Schema()
export class User extends IUser {}

export const UserEntity = SchemaFactory.createForClass(User);
