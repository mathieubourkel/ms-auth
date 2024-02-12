import { IsString, Length } from "class-validator"

export class CreateTokensDto {
    @IsString()
    @Length(1, 250)
    refreshToken:string

    @IsString()
    @Length(1, 250)
    token:string

    @IsString()
    @Length(1, 250)
    emailToken:string
}
