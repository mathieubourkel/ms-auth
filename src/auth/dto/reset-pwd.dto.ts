import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator"

export class ResetPwdDto {
    @IsString()
    @Length(12, 100)
    oldPassword: string
    @IsString()
    @Length(12, 100)
    newPassword: string
    @IsString()
    @IsEmail()
    @Length(1, 150)
    email: string
}