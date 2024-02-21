import { IsOptional, IsString, Length } from "class-validator"
import { UserEntity } from "src/user/entities/user.entity"

export class CreateGroupDto {
    @IsString()
    @Length(1, 50)
    name: string
    @IsOptional()
    @IsString()
    @Length(0,255)
    additionalInfos: string
    @IsString()
    @Length(0, 255)
    description: string
    owner:UserEntity
}
