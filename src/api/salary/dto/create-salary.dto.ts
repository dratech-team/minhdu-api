import { IsCurrency } from "class-validator";

export class CreateSalaryDto {
  @IsCurrency()
  readonly salary: number;
}
