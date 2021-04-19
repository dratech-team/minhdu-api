import {IsOptional, IsString} from "class-validator";

export class UpdateAreaDto {
  code: string;

  @IsOptional()
  @IsString()
  readonly area: string;
}
