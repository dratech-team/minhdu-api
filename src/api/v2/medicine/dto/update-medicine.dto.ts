import {CreateMedicineDto} from './create-medicine.dto';
import {PartialType} from "@nestjs/mapped-types";

export class UpdateMedicineDto extends PartialType(CreateMedicineDto) {
}
