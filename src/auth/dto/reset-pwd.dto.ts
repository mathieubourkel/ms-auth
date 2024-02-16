import { IsNumber, IsString, Length } from "class-validator"

export class ResetPwdDto {
    @IsNumber()
    id: number
    @IsString()
    @Length(12, 100)
    oldPassword: string
    @IsString()
    @Length(12, 100)
    newPassword: string
}