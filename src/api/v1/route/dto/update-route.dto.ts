import {CreateRouteDto} from './create-route.dto';
import {PartialType} from "@nestjs/mapped-types";

export class UpdateRouteDto extends PartialType(CreateRouteDto) {
}
