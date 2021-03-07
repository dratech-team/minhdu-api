import {IsString, Length, IsEmail, IsNotEmpty} from 'class-validator'

export class CreateUserDto {

    @IsString()
    @Length(1, 100)
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @Length(1, 100)
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @Length(8, 100)
    @IsNotEmpty()
    readonly password: string;
}
