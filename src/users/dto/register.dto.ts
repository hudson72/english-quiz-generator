import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class RegisterDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    pass: string;
}
