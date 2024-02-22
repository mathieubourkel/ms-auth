import { IsOptional, IsString } from "class-validator";

export class UpdateTokensDto {
    @IsOptional()
    @IsString()
    refreshToken?:string
    @IsOptional()
    @IsString()
    token?:string
    @IsOptional()
    @IsString()
    validationToken?:string
    @IsOptional()
    @IsString()
    emailToken?:string
    user?:any
}