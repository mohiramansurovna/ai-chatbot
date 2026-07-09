import {IsEmail} from 'class-validator'

export class LoginDto{

    @IsEmail()
    readonly email:string;

    readonly password:string;

}