import { CreateDiagramDto } from './create-diagram.dto';
import {PartialType} from "@nestjs/mapped-types";

export class UpdateDiagramDto extends PartialType(CreateDiagramDto) {}
