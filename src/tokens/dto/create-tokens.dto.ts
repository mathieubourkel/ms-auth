import { IsString } from "class-validator";

export class CreateTokensDto {
    @IsString()
    refreshToken:string
    @IsString()
    token:string
    @IsString()
    validationToken:string
    @IsString()
    emailToken:string
    user:any
}