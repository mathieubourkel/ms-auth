import {  IsEmail, IsString, Length} from "class-validator";

export class LoginDto {
    @IsString()
    @Length(1, 50)
    @IsEmail()
    email:string
    @IsString()
    @Length(8, 100)
    password:string
}