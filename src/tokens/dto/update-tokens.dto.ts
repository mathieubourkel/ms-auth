import { IsOptional, IsString, Length } from "class-validator"

export class UpdateTokensDto {
    @IsOptional()
    @IsString()
    @Length(1, 250)
    refreshToken:string

    @IsOptional()
    @IsString()
    @Length(1, 250)
    token:string

    @IsOptional()
    @IsString()
    @Length(1, 250)
    emailToken:string
}
