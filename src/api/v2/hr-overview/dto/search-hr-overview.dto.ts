import {HrOverviewFilterEnum} from "../entities/hr-overview-filter.enum";
import {IsBoolean, IsEnum, IsNotEmpty} from "class-validator";
import {Type} from "class-transformer";

export class SearchHrOverviewDto {
  @IsNotEmpty()
  @IsEnum(HrOverviewFilterEnum)
  readonly filter: HrOverviewFilterEnum;

  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  readonly isLeft: boolean;
}
