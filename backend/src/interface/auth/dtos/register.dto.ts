import {IsEmail, IsNotEmpty, IsString, IsStrongPassword} from 'class-validator'

export class RegisterBodyDto{

    @IsString()
    @IsNotEmpty()
    readonly name:string;

    @IsEmail()
    readonly email:string;

    @IsStrongPassword()
    readonly password:string;

}
