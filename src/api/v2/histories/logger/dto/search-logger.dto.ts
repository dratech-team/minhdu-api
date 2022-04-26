import {SearchBaseDto} from "../../../../../common/dtos/search-base.dto";
import {IsOptional, IsString} from "class-validator";

export class SearchLoggerDto extends SearchBaseDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly activity: string;

  @IsOptional()
  @IsString()
  readonly description: string;
}
