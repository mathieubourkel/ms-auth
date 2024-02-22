import {  IsString, Length } from "class-validator"

export class ResetPwdDto {
    @IsString()
    @Length(8, 100)
    oldPwd: string
    @IsString()
    @Length(8, 100)
    newPwd: string
    user: any
}