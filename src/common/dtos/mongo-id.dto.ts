import { IsMongoId } from "class-validator";
import { ObjectId } from "mongodb";
import { Type } from "class-transformer";

export class MongoIDDto {
  @Type(() => ObjectId)
  @IsMongoId()
  id: ObjectId;
}
