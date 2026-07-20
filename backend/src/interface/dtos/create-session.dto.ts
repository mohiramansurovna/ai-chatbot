import { IsNotEmpty, IsString } from "class-validator";

export class CreateSessionDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

}