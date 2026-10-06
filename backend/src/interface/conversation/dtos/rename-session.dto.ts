import {IsString } from "class-validator";

export class RenameSessionDto{
    @IsString()
    readonly title:string
}