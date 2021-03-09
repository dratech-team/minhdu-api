import {IsString, Length, IsEmail, IsNotEmpty} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
    @IsString()
    @Length(1, 100)
    @IsNotEmpty()
    @ApiProperty({
        maxLength: 100,
        minLength: 1,
        description: 'User name',
        type: String,
        
    })
    readonly name: string;

    @IsString()
    @Length(1, 100)
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        format: 'email',
        maxLength: 100,
        minLength: 1,
        description: 'User Email',
    })
    readonly email: string;

    @IsString()
    @Length(8, 100)
    @IsNotEmpty()
    @ApiProperty()
    @ApiProperty({
        maxLength: 100,
        minLength: 8,
        description: 'User Password',
    })
    readonly password: string;
}
