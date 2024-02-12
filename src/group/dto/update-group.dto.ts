import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateGroupDto{
    @IsOptional()
    @IsString()
    @Length(1, 50)
    name: string
    @IsOptional()
    @IsString()
    @Length(0,255)
    additionalInfos: string
    @IsOptional()
    @IsString()
    @Length(0, 255)
    description: string
}
