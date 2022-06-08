import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from 'class-validator';

@ValidatorConstraint({name: 'withValidate', async: false})
export class WithValidator implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return text === "workday" || typeof text === "number";
  }

  defaultMessage(args: ValidationArguments) {
    return 'with ($value) must be workday or number';
  }
}
