import { IsInt, IsNumber, IsString, Length } from "class-validator"

export class ForgotPwdDto {
    @IsString()
    @Length(8, 100)
    newPwd: string
    user: any
}