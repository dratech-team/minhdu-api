import {CreateHolidayDto} from './create-holiday.dto';
import {PartialType} from "@nestjs/mapped-types";

export class UpdateHolidayDto extends PartialType(CreateHolidayDto) {
}
